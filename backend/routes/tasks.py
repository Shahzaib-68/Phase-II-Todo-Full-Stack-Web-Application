"""
Task endpoints for Aura Task API – Complete Fixed Version with Safe Field Handling
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, func
from datetime import datetime, timezone

from database import get_session
from auth import get_current_user
from models import Task
from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tasks", tags=["tasks"])


# ============================================================================
# LIST TASKS - Get all tasks for user
# ============================================================================
@router.get("/", response_model=TaskListResponse)
async def list_tasks(
    user_id: str = Query(..., description="User ID to retrieve tasks for"),
    status_filter: str = Query("all", description="Filter by status: all, pending, completed"),
    sort_by: str = Query("created", description="Sort by: created, title, priority"),
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for the authenticated user with optional filtering and sorting.
    """
    logger.info(f"📋 List tasks called for user: {user_id}")
    
    # Security check: user can only access their own tasks
    if user_id != current_user_id:
        logger.warning(f"⚠️ User ID mismatch: {user_id} != {current_user_id}")
        raise HTTPException(status_code=403, detail="Access denied: user_id mismatch")

    # Build ORM query
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    # Apply sorting - SAFE: only sort by priority if field exists
    if sort_by == "title":
        query = query.order_by(Task.title.asc())
    elif sort_by == "priority" and hasattr(Task, 'priority'):
        query = query.order_by(Task.priority.desc())
    else:  # default: created
        query = query.order_by(Task.created_at.desc())

    try:
        tasks = session.exec(query).all()
        logger.info(f"✅ Found {len(tasks)} tasks")
    except Exception as e:
        logger.error(f"❌ Tasks load fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Tasks load fail: {str(e)}")

    # Convert to response format with safe attribute access
    task_responses = []
    for task in tasks:
        task_responses.append(
            TaskResponse(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description or "",
                priority=getattr(task, 'priority', 'medium'),
                due_date=getattr(task, 'due_date', None),
                completed=task.completed,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
        )

    # Get total count with same filters
    count_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    if status_filter == "pending":
        count_query = count_query.where(Task.completed == False)
    elif status_filter == "completed":
        count_query = count_query.where(Task.completed == True)

    count = session.exec(count_query).one()

    logger.info(f"📊 Returning {len(task_responses)} tasks, total count: {count}")
    return TaskListResponse(tasks=task_responses, count=count)


# ============================================================================
# GET STATS - Task statistics (MUST come before /{task_id})
# ============================================================================
@router.get("/stats")
async def get_task_stats(
    user_id: str = Query(..., description="User ID to get stats for"),
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get task statistics for the authenticated user.
    """
    logger.info(f"📊 Getting stats for user: {user_id}")
    
    # Security check
    if user_id != current_user_id:
        logger.warning(f"⚠️ User ID mismatch: {user_id} != {current_user_id}")
        raise HTTPException(status_code=403, detail="Access denied: user_id mismatch")

    try:
        # Count total tasks
        total = session.exec(
            select(func.count()).select_from(Task).where(Task.user_id == user_id)
        ).one()
        
        # Count pending tasks
        pending = session.exec(
            select(func.count()).select_from(Task).where(
                Task.user_id == user_id, 
                Task.completed == False
            )
        ).one()
        
        # Count completed tasks
        completed = session.exec(
            select(func.count()).select_from(Task).where(
                Task.user_id == user_id, 
                Task.completed == True
            )
        ).one()

        stats = {
            "total": total,
            "pending": pending,
            "completed": completed
        }
        
        logger.info(f"✅ Stats: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"❌ Stats fetch fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stats fetch fail: {str(e)}")


# ============================================================================
# GET STATS SUMMARY - Alternative stats endpoint (legacy support)
# ============================================================================
@router.get("/stats/summary")
async def get_task_stats_summary(
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get task statistics without user_id parameter (uses authenticated user).
    """
    logger.info(f"📊 Getting stats summary for user: {current_user_id}")
    
    user_id = current_user_id

    try:
        total = session.exec(
            select(func.count()).select_from(Task).where(Task.user_id == user_id)
        ).one()
        
        pending = session.exec(
            select(func.count()).select_from(Task).where(
                Task.user_id == user_id, 
                Task.completed == False
            )
        ).one()
        
        completed = session.exec(
            select(func.count()).select_from(Task).where(
                Task.user_id == user_id, 
                Task.completed == True
            )
        ).one()

        stats = {
            "total": total,
            "pending": pending,
            "completed": completed
        }
        
        logger.info(f"✅ Stats summary: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"❌ Stats summary fetch fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stats summary fetch fail: {str(e)}")


# ============================================================================
# CREATE TASK - Add new task
# ============================================================================
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    logger.info(f"➕ Creating task for user: {current_user_id}")
    logger.debug(f"Task data: {task_data}")
    
    user_id = current_user_id

    # Create new task instance with safe attribute setting
    task_kwargs = {
        'user_id': user_id,
        'title': task_data.title,
        'description': task_data.description or "",
        'completed': False,
        'created_at': datetime.now(timezone.utc),
        'updated_at': datetime.now(timezone.utc)
    }
    
    # ✅ SAFE: Only add priority if Task model has the field
    if hasattr(Task, 'priority'):
        task_kwargs['priority'] = getattr(task_data, 'priority', 'medium')
    
    # ✅ SAFE: Only add due_date if Task model has the field
    if hasattr(Task, 'due_date'):
        task_kwargs['due_date'] = getattr(task_data, 'due_date', None)
    
    new_task = Task(**task_kwargs)

    try:
        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        logger.info(f"✅ Task created with ID: {new_task.id}")
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Task create fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Task create fail: {str(e)}")

    return TaskResponse(
        id=new_task.id,
        user_id=new_task.user_id,
        title=new_task.title,
        description=new_task.description or "",
        priority=getattr(new_task, 'priority', 'medium'),
        due_date=getattr(new_task, 'due_date', None),
        completed=new_task.completed,
        created_at=new_task.created_at,
        updated_at=new_task.updated_at
    )


# ============================================================================
# GET SINGLE TASK - Retrieve specific task by ID
# ============================================================================
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID.
    """
    logger.info(f"🔍 Getting task {task_id} for user {current_user_id}")
    
    task = session.get(Task, task_id)
    
    if not task:
        logger.warning(f"⚠️ Task not found: {task_id}")
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.user_id != current_user_id:
        logger.warning(f"⚠️ Access denied: task {task_id} belongs to different user")
        raise HTTPException(status_code=403, detail="Access denied")

    logger.info(f"✅ Task {task_id} retrieved")
    
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description or "",
        priority=getattr(task, 'priority', 'medium'),
        due_date=getattr(task, 'due_date', None),
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


# ============================================================================
# UPDATE TASK - Modify existing task (SAFE VERSION)
# ============================================================================
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing task - SAFELY handles optional fields.
    """
    logger.info(f"✏️ Updating task {task_id}")
    
    task = session.get(Task, task_id)
    
    if not task:
        logger.warning(f"⚠️ Task not found: {task_id}")
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.user_id != current_user_id:
        logger.warning(f"⚠️ Access denied: task {task_id} belongs to different user")
        raise HTTPException(status_code=403, detail="Access denied")

    # ✅ Update core fields (always present)
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed
    
    # ✅ SAFE: Only update priority if BOTH model and data have it
    if hasattr(task_data, 'priority') and task_data.priority is not None:
        if hasattr(task, 'priority'):
            task.priority = task_data.priority
            logger.info(f"✅ Updated priority to: {task_data.priority}")
        else:
            logger.warning(f"⚠️ Task model doesn't have 'priority' field - skipping")
    
    # ✅ SAFE: Only update due_date if BOTH model and data have it
    if hasattr(task_data, 'due_date') and task_data.due_date is not None:
        if hasattr(task, 'due_date'):
            task.due_date = task_data.due_date
            logger.info(f"✅ Updated due_date to: {task_data.due_date}")
        else:
            logger.warning(f"⚠️ Task model doesn't have 'due_date' field - skipping")

    task.updated_at = datetime.now(timezone.utc)

    try:
        session.add(task)
        session.commit()
        session.refresh(task)
        logger.info(f"✅ Task {task_id} updated successfully")
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Task update fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Task update fail: {str(e)}")
    
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description or "",
        priority=getattr(task, 'priority', 'medium'),
        due_date=getattr(task, 'due_date', None),
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


# ============================================================================
# DELETE TASK - Remove task
# ============================================================================
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task.
    """
    logger.info(f"🗑️ Deleting task {task_id}")
    
    task = session.get(Task, task_id)
    
    if not task:
        logger.warning(f"⚠️ Task not found: {task_id}")
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.user_id != current_user_id:
        logger.warning(f"⚠️ Access denied: task {task_id} belongs to different user")
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        session.delete(task)
        session.commit()
        logger.info(f"✅ Task {task_id} deleted")
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Task delete fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Task delete fail: {str(e)}")


# ============================================================================
# TOGGLE COMPLETION - Mark task as complete/incomplete
# ============================================================================
@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status (complete ↔ incomplete).
    """
    logger.info(f"✅ Toggling completion for task {task_id}")
    
    task = session.get(Task, task_id)
    
    if not task:
        logger.warning(f"⚠️ Task not found: {task_id}")
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.user_id != current_user_id:
        logger.warning(f"⚠️ Access denied: task {task_id} belongs to different user")
        raise HTTPException(status_code=403, detail="Access denied")

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    try:
        session.add(task)
        session.commit()
        session.refresh(task)
        logger.info(f"✅ Task {task_id} completion toggled to {task.completed}")
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Task toggle fail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Task toggle fail: {str(e)}")
    
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description or "",
        priority=getattr(task, 'priority', 'medium'),
        due_date=getattr(task, 'due_date', None),
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )