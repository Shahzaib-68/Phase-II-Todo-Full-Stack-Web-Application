import sys
import os
sys.path.insert(0, '.')
sys.path.insert(0, './src')

# Add debugging to see what's happening
print("Starting server...")

try:
    from main import app
    print("Successfully imported app from main")
    
    import uvicorn
    print("Successfully imported uvicorn")
    
    print("Attempting to run server...")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()