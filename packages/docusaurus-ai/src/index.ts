export interface PluginOptions {
    chatUrl?: string;
}

import { DocusaurusContext, ThemeConfig } from "@docusaurus/types";
const PLUGIN_NAME = "@ahelmy/docusaurus-ai";


export default function DocusaurusAIPlugin(
  context: DocusaurusContext,
  options?: PluginOptions,
): any {
  const chatUrl = options?.chatUrl || "/api/predict";
  return {
    name: PLUGIN_NAME,
    injectHtmlTags() {
        return {
            postBodyTags: [
              `<script>
                // Define global variables for state management
                let showPopup = false;
                let loading = false;
                let question = "";
                let answer = "";

                // Helper functions
                function togglePopup() {
                  showPopup = !showPopup;
                  render();
                }

                function handleInputChange(event) {
                  question = event.target.value;
                }

                function handleButtonClick() {
                  if(question=='' || question==null){
                    return;
                  }
                  loading = true;
                  render();

                  fetch("${chatUrl}?q="+encodeURIComponent(question))
                    .then((response) => response.json())
                    .then((data) => {
                      answer = data.result;
                      render();
                    })
                    .finally(() => {
                      loading = false;
                      render();
                    });
                }

                function render() {
                  // Clear existing content
                  const root = document.getElementById("assistant-root");
                  root.innerHTML = "";

                  // Create the main container
                  const container = document.createElement("div");
                  container.style.position = "fixed";
                  container.style.bottom = "20px";
                  container.style.right = "20px";

                  // Create the toggle button
                  const toggleButton = document.createElement("button");
                  toggleButton.onclick = togglePopup;
                  Object.assign(toggleButton.style, {
                    backgroundColor: "var(--ifm-color-primary)",
                    border: "none",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    color: "white",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  });
                  toggleButton.innerHTML = '<span role="img" aria-label="assistant">🪄</span>';
                  container.appendChild(toggleButton);

                  // Create the popup
                  if (showPopup) {
                    const popup = document.createElement("div");
                    Object.assign(popup.style, {
                      position: "absolute",
                      bottom: "80px",
                      right: "0",
                      width: "300px",
                      maxHeight: "400px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      padding: "10px",
                    });

                    // Create the answer textarea
                    if (answer) {
                      const answerArea = document.createElement("textarea");
                      answerArea.value = answer;
                      answerArea.readOnly = true;
                      Object.assign(answerArea.style, {
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        height: "150px",
                      });
                      popup.appendChild(answerArea);
                    }

                    // Create a container for input and button
                    const inputContainer = document.createElement("div");
                    inputContainer.style.display = "flex";
                    inputContainer.style.alignItems = "center";
                    inputContainer.style.gap = "10px";

                    // Create the question input
                    const questionInput = document.createElement("input");
                    questionInput.type = "text";
                    questionInput.value = question;
                    questionInput.placeholder = "Enter your question";
                    questionInput.oninput = handleInputChange;
                    Object.assign(questionInput.style, {
                      flexGrow: "1",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    });
                    inputContainer.appendChild(questionInput);

                    // Create the submit button
                    const submitButton = document.createElement("button");
                    submitButton.onclick = handleButtonClick;
                    submitButton.textContent = loading ? "Thinking..." : "Submit";
                    submitButton.disabled = loading;
                    Object.assign(submitButton.style, {
                      padding: "10px",
                      backgroundColor: loading ? "#cccccc" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                    });
                    inputContainer.appendChild(submitButton);

                    popup.appendChild(inputContainer);
                    container.appendChild(popup);
                  }

                  root.appendChild(container);
                }

                // Initialize the app
                function initAssistant() {
                  const root = document.createElement("div");
                  root.id = "assistant-root";
                  document.body.appendChild(root);
                  render();
                }

                // Start the assistant
                initAssistant();
              </script>`
            ]
        };
    },
    async postBuild() {
      // Hook to process docs after build.
    },
    async loadContent() {
        // Hook to process docs during build.
    },
  };
}

