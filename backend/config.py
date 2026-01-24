"""
Environment configuration for the task management API.
"""
from pydantic_settings import BaseSettings
from typing import List, Union
import json
from pydantic import field_validator, model_validator


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    database_url: str = "postgresql://username:password@hostname:5432/database_name"
    better_auth_secret: str = "your-secret-key-minimum-32-characters-long-random-string"
    better_auth_url: str = "http://localhost:8000"
    allowed_origins: Union[str, List[str]] = "http://localhost:3000,https://yourdomain.com"
    environment: str = "development"
    log_level: str = "info"
    port: int = 8000
    db_pool_size: int = 10
    db_max_overflow: int = 20

    class Config:
        env_file = ".env"

    @property
    def auth_secret_bytes(self) -> bytes:
        """Convert the auth secret to bytes for JWT operations."""
        return self.better_auth_secret.encode("utf-8")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        """Handle different formats of allowed_origins input."""
        if isinstance(v, str):
            # Check if it's a JSON-formatted string
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    # If JSON parsing fails, fall back to comma splitting
                    return [x.strip() for x in v.split(",")]
            # Otherwise, split by comma
            return [x.strip() for x in v.split(",")]
        elif isinstance(v, list):
            return v
        else:
            # If it's neither a string nor a list, return as-is
            return v

    @model_validator(mode="after")
    def configure_database_url(self):
        """
        Configure database URL for different environments.
        Handles SSL and removes problematic parameters.
        """
        if self.database_url:
            # Remove single quotes if present
            self.database_url = self.database_url.strip("'\"")
            
            # Remove channel_binding (causes issues with some versions)
            if "channel_binding=" in self.database_url:
                self.database_url = self.database_url.split("&channel_binding=")[0]
            
            # Add SSL mode if not present
            if "sslmode" not in self.database_url:
                # Development: Disable SSL (for local PostgreSQL)
                if self.environment == "development":
                    separator = "&" if "?" in self.database_url else "?"
                    self.database_url = f"{self.database_url}{separator}sslmode=disable"
                    print(f"🔧 SSL disabled for development environment")
                # Production: Require SSL (for hosted databases like Neon, Supabase)
                else:
                    separator = "&" if "?" in self.database_url else "?"
                    self.database_url = f"{self.database_url}{separator}sslmode=require"
                    print(f"🔒 SSL required for production environment")
            else:
                print(f"🔒 Using SSL mode from DATABASE_URL")
        
        return self


settings = Settings()