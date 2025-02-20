"use client";
import { useState } from "react";
// import { motion } from "framer-motion";
import Image from "next/image";
import "./style.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); // For AI typing effect

  const extractUsername = (userInput: string) => {
    const match = userInput.match(/^([^@]+)/);
    return match ? match[1] : "User";
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return alert("Please enter a valid email.");

    setLoading(true);

    try {
      const response = await fetch("./api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userInput }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Something went wrong");

      alert("Your request for early access has been sent!");
      setUserInput(""); // Clear input after submission
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        alert(error.message || "Something went wrong. Please try again.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="containerMax">
        {/*NavBar*/}
        <div className="nav">
          <a href="https://git.new/sayhalo" target="_blank" rel="noreferrer">
            <div className="logo" role="button" tabIndex={0}>
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              SayHalo
            </div>
          </a>
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
              <div className="textTop1">
                Hi, {userInput ? extractUsername(userInput) : "User"}
              </div>
              <div className="textTop2">Sign up for Early Access!</div>
              <div className="textBottom">
                Be among the first to experience the power of a SLM Aggregator.
                Join now to explore seamless conversations, and instant
                assistance with SayHalo.
              </div>
            </div>
          </div>
          <div className="inputContainer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(); // Pass the user's email
              }}
            >
              <div className="inputBox">
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
                      disabled={true}
                    />

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
                  type="email"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className="buttonSubmit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Request"}{" "}
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
            </form>
          </div>
        </div>
        <div className="textBottomGlobal">
          © 2025 SayHalo. All rights reserved.<br></br>
          <b>About this website:</b> built with React & Next.js (App Router),
          TypeScript, Tailwind CSS, Framer Motion, Resend, Vercel hosting.
        </div>
      </div>
    </>
  );
}
