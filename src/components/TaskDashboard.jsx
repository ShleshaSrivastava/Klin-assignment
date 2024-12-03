import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask, toggleComplete, editTask } from '../features/tasks/taskSlice';
import { Segmented, DatePicker, Input, Button, Dropdown, Modal } from "antd";
import moment from 'moment';
import { EllipsisVertical } from 'lucide-react';
import ActivityBar from './activityBar';

const TaskDashboard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (editingTask) {
      dispatch(editTask({
        id: editingTask.id,
        ...newTask,
      }));
      setEditingTask(null);
    } else {
      dispatch(addTask({ ...newTask, id: Date.now(), completed: false }));
    }
    setNewTask({ title: '', description: '', dueDate: '' });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', dueDate: '' });
  };

  const handleEdit = (task) => {
    setIsModalOpen(true);
    setNewTask({ title: task.title, description: task.description, dueDate: task.dueDate });
    setEditingTask(task);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchTerm) {
      return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filter === 'Completed') {
      return task.completed;
    }
    if (filter === 'Pending') {
      return !task.completed;
    }
    if (filter === 'Overdue') {
      return moment(task.dueDate).isBefore(moment(), 'day');
    }
    return true;
  });

  const { TextArea } = Input;

  return (
    <div className='task-dashboard-layout'>
      <ActivityBar tasks={tasks} />

      <div className='data-section'>
        <div className='task-section'>
          <div className="actionBar">
            <Segmented
              options={['All', 'Completed', 'Pending', 'Overdue']}
              onChange={(value) => setFilter(value)}
              size='large'
              className='SegmentedTab'
            />
            <div className='rightActionbar'>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='mb-2'
              />
              <Button type="primary" onClick={showModal}>
                Add Task
              </Button>
            </div>

            <Modal title={editingTask ? 'Update Task' : 'Add Task'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <Input
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className='mb-2'
              />
              <TextArea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                autoSize={{ minRows: 3, maxRows: 5 }}
                className='mb-2'
              />
              <DatePicker
                value={newTask.dueDate ? moment(newTask.dueDate) : null}
                onChange={(date, dateString) => setNewTask({ ...newTask, dueDate: dateString })}
              />
            </Modal>
          </div>

          {filteredTasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            filteredTasks.map((task) => (
              <div 
                className={`taskCard ${expandedTaskId === task.id ? 'expanded' : ''}`} 
                key={task.id}
                onMouseEnter={() => setExpandedTaskId(task.id)}
                onMouseLeave={() => setExpandedTaskId(null)}
              >
                <div className='taskCardCTA'>
                  <p>{task.title}</p>
                  <p className='dueDate'>{task.dueDate}</p>
                  <div className='taskContainer'>
                    <Button onClick={() => dispatch(toggleComplete(task.id))}>
                      {task.completed ? 'Undo' : 'Complete'}
                    </Button>
                    <Dropdown
                      menu={{
                        items: [
                          { key: '1', label: <Button type="text" onClick={() => handleEdit(task)}>Edit</Button> },
                          { key: '2', label: <Button type="text" onClick={() => handleDelete(task.id)}>Delete</Button> },
                        ],
                      }}
                      placement="bottomRight"
                      >
                      <Button className='taskActionIcon'>
                        <EllipsisVertical />
                      </Button>
                    </Dropdown>
                  </div>
                </div>
                
                {expandedTaskId === task.id && (
                  <div className="task-description">
                    <p>{task.description}</p>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;