import React, { useState, useEffect, useRef } from "react";
import Card from './Card'
import axios from "axios";
import { v4 as uuid} from 'uuid';


const CardTable2 = () => {
    const [deck, setDeck] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false)
    const deckId = useRef();
    const timerId = useRef();

    const BASE_URL = "http://deckofcardsapi.com/api/deck/"

    const drawCard = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/${deckId.current}/draw`)
            if (!response.data.success) {
                if (response.data.error === "Not enough cards remaining to draw 1 additional") {
                    alert("End of Deck, Reload Page")
                    throw Error("End of Deck");
                }
            }
            const card = response.data.cards[0]
            setDeck(deck => [...deck, {card, id: uuid()}])
        } catch (e) {
            console.log(e);
        }
    }

    const toggleIsDrawing = () => {
        setIsDrawing(!isDrawing)
    }

    useEffect(function getDeckOnMount() {
        async function getDeckId() {
            const response = await axios.get(`${BASE_URL}/new/shuffle`);
            deckId.current = response.data.deck_id;
        }
        getDeckId();
    }, [])

    useEffect(function setTimer() {
        if (isDrawing) {
            timerId.current = setInterval(() => {
                drawCard();
            }, 1000);
        }

        return function cleanUpTimer() {
            clearInterval(timerId.current);
        }
    }, [timerId, isDrawing])


    return (
        <div>
            <button onClick={toggleIsDrawing}>{isDrawing ? 'Stop!' : 'Start Drawing!'}</button>
            {deck.map(c => {
				return <Card card={c} key={c.id}/>
			})}
        </div>
    )
}

export default CardTable2;