import sys
import importlib

# Remove the models module from sys.modules if it exists
if 'models' in sys.modules:
    del sys.modules['models']

# Remove the backend path from sys.path and add it again to force reload
backend_path = './'
if backend_path in sys.path:
    sys.path.remove(backend_path)
sys.path.insert(0, backend_path)

# Now import fresh
from models import Task
print('Fresh import - Task fields:', list(Task.model_fields.keys()))