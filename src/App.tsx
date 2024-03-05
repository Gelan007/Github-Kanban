import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import GithubKanbanBoardContainer from "./components/kanbanBoard/GithubKanbanBoardContainer";


function App() {
  return (
      <div>
        <GithubKanbanBoardContainer></GithubKanbanBoardContainer>
      </div>
  );
}

export default App;
