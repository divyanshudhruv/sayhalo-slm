"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For smooth animations
import Image from "next/image";
import "./style.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [animate, setAnimate] = useState(false);
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [loading, setLoading] = useState(false); // For AI typing effect
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    let name = localStorage.getItem("userName");
    if (!name) {
      name = prompt("Please enter your name", "User");
      if (name != null) {
        localStorage.setItem("userName", name);
      }
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const formatResponse = (response: string) => {
    return response
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>") // Code block
      .replace(/^- (.*?)/gm, "<li>$1</li>"); // Bullet points
  };

  const chatInit = async (userInput: string) => {
    if (userInput.trim() === "") return;

    setMessages((prev) => [...prev, { user: userInput, ai: "" }]);

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_TRAIN_1_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userInput }] }],
          }),
        }
      );

      const data = await response.json();
      let aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that.";

      aiResponse = formatResponse(aiResponse); // Apply formatting

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, ai: aiResponse } : msg
        )
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1
              ? { ...msg, ai: "Something went wrong. Try again later." }
              : msg
          )
        );
      }, 700);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    setAnimate(true); // Trigger animations
    chatInit(userInput);
    setUserInput(""); // Clear input field after sending

    // Hide elements with animations
    ["defaultTop", "trendingBoxContainer"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.opacity = "0";
        element.style.animation = "eeonOut 0.3s ease";
        setTimeout(() => {
          element.style.display = "none";
        }, 500);
      }
    });

    // Show chat container with animation
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.style.display = "flex";
        chatContainer.style.opacity = "1";
        chatContainer.style.animation = "eeonChatIn 0.3s ease";
      }, 500);
    }
  };

  return (
    <>
      <div className="containerMax">
        {/*NavBar*/}
        <div className="nav">
          <div
            className="logo"
            onClick={() => window.location.reload()}
            onKeyDown={() => window.location.reload()}
            role="button"
            tabIndex={0}
          >
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            SayHalo
          </div>
          <div className="profile">
            <div className="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="#464646"
                  d="M2.359 11.638 1.5 14.5h13l-.859-2.862A3 3 0 0 0 10.768 9.5H5.232a3 3 0 0 0-2.873 2.138Z"
                />
                <circle cx="8" cy="4.5" r="3" stroke="#464646" />
              </svg>
            </div>
          </div>
        </div>
        {/*NavBar ENDS*/}

        {/*Chat Container*/}
        <div className="mainContainer">
          <div className="responseContainer">
            <div className="top" id="defaultTop">
              <div className="logo">
                {" "}
                <Image src="/logo.png" alt="Logo" width={70} height={70} />
              </div>
              <div className="textTop1">Hi, {userName}</div>
              <div className="textTop2">Can I help you with anything?</div>
              <div className="textBottom">
                Ready to assist you with anything you need, from answering
                questions to providing recommendations. Let's get started
              </div>
            </div>

            <div className="chat" id="chatContainer">
              {messages.map((msg, index) => (
                <div key={index}>
                  <div className="userPromptContainer">
                    <div className="userPrompt">{msg.user}</div>
                  </div>

                  {msg.ai && (
                    <div className="aiPromptContainer">
                      <div className="logo">
                        {" "}
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="aiPrompt">
                        <div
                          className="ai-message"
                          dangerouslySetInnerHTML={{ __html: msg.ai }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="scrollDown"></div>
            </div>
          </div>
          {/*AI Response Container for responses ENDS*/}

          {/*Input Container for prompts */}

          <div className="inputContainer">
            <div className="tabs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  stroke="currentColor"
                  d="M1.5 14.5v-9h13v9h-13ZM1.5 5.5v-4h13v4h-13ZM3 3.5h1M5 3.5h1M7 3.5h1"
                />
              </svg>
            </div>
            <div className="inputBox">
              {/*Trending Boxes*/}
              <div className="trendingBoxContainer" id="trendingBoxContainer">
                <div className="box">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      strokeWidth={1.1}
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        stroke="currentColor"
                        d="M1.5 13.5v-10h13v10h-13ZM1.5 7.5h13M5.5 6v3M10.5 6v3M5.5 3.5v-1l1-1h3l1 1v1"
                      />
                    </svg>
                  </div>
                  <div className="textBig">Wanderlust Destinations 2025</div>
                  <div className="textSmall">Multivisit places</div>
                </div>
                <div className="box">
                  {" "}
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      strokeWidth={1.1}
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
                      <ellipse
                        cx="8"
                        cy="8"
                        stroke="currentColor"
                        rx="2.5"
                        ry="6.5"
                      />
                      <path stroke="currentColor" d="M1.5 8h13" />
                    </svg>
                  </div>
                  <div className="textBig">SayHalo AI: What's new?</div>
                  <div className="textSmall">The deployment</div>
                </div>
                <div className="box">
                  {" "}
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      strokeWidth={1.1}
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        stroke="currentColor"
                        d="M1.5 1.5h13v13h-13zM5 6v6M8 4v8M11 8v4"
                      />
                    </svg>
                  </div>
                  <div className="textBig">Design trends in 2025</div>
                  <div className="textSmall">Gradient fills and more</div>
                </div>
              </div>
              <div className="settings ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke="#FAF7FA"
                    d="M8 1v2M11.5 1.938l-1 1.732M14.062 4.5l-1.732 1M1.938 4.5l1.732 1M8 13v2M10.5 12.33l1 1.732M3.67 10.5l-1.732 1M12.33 10.5l1.732 1M3 8H1"
                  />
                  <circle cx="8" cy="8" r="5" stroke="#FAF7FA" />
                  <path
                    stroke="#FAF7FA"
                    d="M4.5 1.938 8 8M15 8H8M4.5 14.062 8 8"
                  />
                </svg>
              </div>
              <div>
                <div>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                  />

                  {/* Styled button (label) with SVG inside */}
                  <label htmlFor="fileInput" className="fileButton">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      strokeWidth={1.1}
                      height="21"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        stroke="currentColor"
                        d="M7.5 7.5H15"
                        strokeWidth={1.1}
                      />
                      <circle
                        cx="4.5"
                        cy="7.5"
                        r="3"
                        stroke="currentColor"
                        strokeWidth={1.1}
                      />
                      <path
                        stroke="currentColor"
                        d="M11.5 7.5V10M14.5 7.5V10"
                        strokeWidth={1.1}
                      />
                    </svg>
                  </label>
                </div>
              </div>{" "}
              <input
                type="text"
                maxLength={100}
                spellCheck={false}
                placeholder="Ask SayHalo anything..."
                id="userPrompt"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <button
                className="buttonSubmit"
                type="button"
                id="sendButton"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Send{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth={1.5}
                    d="M13.5 1.5v1a4 4 0 0 1-4 4H8M10.5 6.5v.742a4 4 0 0 1-3.75 3.992L2.5 11.5"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth={1.5}
                    d="M2.5 15v-3.5c0-5.523 4.477-10 10-10H14"
                  />
                  <path
                    fill="currentColor"
                    strokeWidth={1.5}
                    d="m2.5 1 .424 1.076L4 2.5l-1.076.424L2.5 4l-.424-1.076L1 2.5l1.076-.424L2.5 1ZM11.5 10l.707 1.793L14 12.5l-1.793.707L11.5 15l-.707-1.793L9 12.5l1.793-.707L11.5 10ZM13.5 7l.424 1.076L15 8.5l-1.076.424L13.5 10l-.424-1.076L12 8.5l1.076-.424L13.5 7Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/*Input Container for prompts ENDS*/}
        </div>
        {/*Chat Container ENDS */}
      </div>
    </>
  );
}
