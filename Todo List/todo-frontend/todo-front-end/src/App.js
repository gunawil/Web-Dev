import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SideBar from './components/SideBar';
import CategoryView from './components/CategoryView';
import TaskView from './components/TaskView';
import TagView from './components/TagView';
import { CategoryProvider } from './contexts/CategoryProvider';
import { TaskProvider } from './contexts/TaskProvider';
import { TagProvider } from './contexts/TagProvider';
import { useState, useEffect } from 'react';

function App() {
  const [activeFeature, setActiveFeature] = useState('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [selectedTagId, setSelectedTagId] = useState();

  return (
    <TaskProvider>
      <CategoryProvider>
        <TagProvider>
          <Container fluid className='h-100 p-0'>
            <Row className='h-100 g-0'>
              <Col lg={2}>
                <SideBar onSelectFeature={feature=>setActiveFeature(feature)} onSelectCategoryId={catId => setSelectedCategoryId(catId)} onSelectTagId={tagId => setSelectedTagId(tagId)}/>
              </Col>
              <Col lg={10} className='h-100'>
                {activeFeature === 'categories' && <CategoryView/>}
                {activeFeature === 'tasks_upcoming' && <TaskView filteredState={'UPCOMING'}/>}
                {activeFeature === 'tasks_today' && <TaskView filteredState={'TODAY'}/>}
                {activeFeature === 'tasks_all' && <TaskView filteredState={'ALL'}/>}
                {activeFeature === 'task_category' && <TaskView filteredState='CATEGORY' categoryId={selectedCategoryId}/>}
                {activeFeature === 'task_tag' && <TaskView filteredState='TAG' tagId={selectedTagId}/>}
                {activeFeature === 'tags' && <TagView/>}
              </Col>
            </Row>
          </Container>
        </TagProvider>
      </CategoryProvider>
    </TaskProvider>
  );
}

export default App;
