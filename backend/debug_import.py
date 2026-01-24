import sys
sys.path.insert(0, '.')
try:
    from models import Task
    print('Task model imported successfully')
    print('Fields in model:')
    for attr_name in ['id', 'user_id', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'updated_at']:
        try:
            attr = getattr(Task, attr_name)
            print(f'  {attr_name}: {type(attr)} - OK')
        except AttributeError:
            print(f'  {attr_name}: MISSING')
except Exception as e:
    print(f"Error importing Task model: {e}")
    import traceback
    traceback.print_exc()