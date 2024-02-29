import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import GithubKanbanBoardContainer from "./components/kanbanBoard/GithubKanbanBoardContainer";
import GithubKanbanBoard from "./components/kanbanBoard/GithubKanbanBoard";


interface Card {
  id: number,
  text: string,
  title: string
}

function App() {
  const [cardList, setCardList] = useState<Card[]>([
    {id: 1, title: "title1", text: "someText"},
    {id: 2, title: "title2", text: "someText2"},
    {id: 3, title: "title3", text: "someText3"},
    {id: 4, title: "title4", text: "someText4"}
  ])

  const [selectedDragCard, setSelectedDragCard] = useState<Card | null>(null)

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    console.log("drag", card)
    setSelectedDragCard(card)
  }

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.style.background = 'white'
  }

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const target = e.target as HTMLDivElement;
    target.style.background = 'lightgrey'
  }

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.preventDefault()
    const target = e.target as HTMLDivElement;
    target.style.background = 'white'
    console.log("drop", card)

    setCardList((cards) => switchDragCardsPosition(cards, card, selectedDragCard!))
  }

  const switchDragCardsPosition = (cards: Card[], droppedCard: Card, draggableCard: Card): Card[] => {
    return cards.map(c => {
          if(c.id === droppedCard.id) {
            return draggableCard || c
          }
          if(c.id === draggableCard?.id) {
            return droppedCard
          }

          return c
        }
    )
  }

  return (
      /*<div className="App">
        {cardList.map((card) =>
            <div
                draggable={true}
                className="card"
                onDragStart={(e) => dragStartHandler(e, card)}
                onDragLeave={(e) => dragEndHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, card)}
            >
              {card.text}
            </div>
        )}
      </div>*/
      <div>
        <GithubKanbanBoard></GithubKanbanBoard>
      </div>
  );
}

export default App;
