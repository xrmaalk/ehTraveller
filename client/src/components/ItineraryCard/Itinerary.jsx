import React, { useContext, useState } from "react"
import { AuthContext } from "../Auth/AuthProvider"
import "./ItineraryCard.css"
import "../../global.css"

function Itinerary() {
  const { auth } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [eventData, setEventData] = useState({
    date: "",
    email: "",
    username: "",
    eventTime: "",
    eventTitle: "",
    place: "",
    user: "",
  })
  const [loadError, setLoadError] = useState(null)

  const closeModal = () => {
    setModalType(null)
    setShowModal(false)
    setLoadError(null)
  }

  const handleEventCreation = async (event) => {
    event.preventDefault()
    if (!auth || !auth.accessToken) {
      setModalType("signin")
      setShowModal(true)
      return
    }
    try {
      console.log("EventData: ", eventData)
      console.log("User:", eventData.user)

      const response = await fetch("/api/dayevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventData,
          eventTitle: eventData.eventTitle,
          email: eventData.email,
        }),
      })
      if (!response.ok) {
        throw new Error("Event creation failed...")
      }
      console.log("Event created successfully:", await response.json())
      closeModal()
    } catch (error) {
      console.error("Event creation error:", error)
      setLoadError(error.message)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      {showModal && modalType === "signin" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <section className="flex w-full text-center flex-row justify-center text-primary-night">
              SignUp or SignIn to Continue...
            </section>
            {loadError && <div className="error">{loadError}</div>}
          </div>
        </div>
      )}
      <div className="event-container flex  m-4 gap-2 p-2.5">
        {loadError && <div className="error">{loadError}</div>}
        <form onSubmit={handleEventCreation}>
          <label htmlFor="eventTitle">Event Title:</label>
          <input
            type="text"
            id="eventTitle"
            name="eventTitle"
            required
            maxLength="100"
            value={eventData.eventTitle}
            onChange={handleInputChange}
          />
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={eventData.date}
            onChange={handleInputChange}
          />
          <label htmlFor="date">Event Time:</label>
          <input
            type="time"
            id="eventTime"
            name="eventTime"
            required
            value={eventData.eventTime}
            onChange={handleInputChange}
          />
          <label htmlFor="date">Place:</label>
          <input
            type="text"
            id="place"
            name="place"
            required
            value={eventData.place}
            onChange={handleInputChange}
          />
          <label htmlFor="date">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={eventData.username}
            onChange={handleInputChange}
          />
          <label htmlFor="date">Email:</label>
          <input
            className="bg-green-200 border-solid text-wrap text-black "
            type="email"
            id="email"
            name="email"
            required
            value={eventData.email}
            onChange={handleInputChange}
          />
          <button className="eventButton" onClick={handleEventCreation}>
            <i className="fa-solid fa-pen-to-square "> Create Event</i>
          </button>
        </form>
      </div>
    </>
  )
}

export default Itinerary