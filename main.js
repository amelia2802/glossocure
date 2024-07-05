import './style.css';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const modelId = 'anthropic.claude-v2';
const paragraphPrompt = "Generate a paragraph for speaking practice. Imagine you are answering an interview(news,job,entertainment) question.";
const tips = "Give daily two liner tip to overcome speaking anxiety.";

const paragraphConversation = [
  {
    role: "user",
    content: [{ text: paragraphPrompt }],
  },
];

const tipsConversation = [
  {
    role: "user",
    content: [{ text: tips }],
  },
];

let client = null;


async function fetchNewParagraph() {
  disableButton(true);
  showLoadingAnimation();

  try {
    // Fetching paragraph for speaking practice
    const response = await client.send(new ConverseCommand({ modelId, messages: paragraphConversation }));
    console.log("Response from Bedrock (Paragraph):", response);
    const paragraph = response.output.message.content[0].text;
    document.querySelector("#paragraph").innerHTML = paragraph;
  } catch (err) {
    console.error("Error fetching new paragraph:", err);
    document.querySelector("#paragraph").innerHTML = 'An error occurred while fetching the paragraph.';
  }

  disableButton(false);
}

async function fetchNewTip(){
    try {
        // Fetching daily tip for speaking anxiety
        const response = await client.send(new ConverseCommand({ modelId, messages: tipsConversation }));
        console.log("Response from Bedrock (Tips):", response);
        const tip = response.output.message.content[0].text;
        document.querySelector("#tips").innerHTML = tip;
      } catch (err) {
        console.error("Error fetching daily tip:", err);
        document.querySelector("#tips").innerHTML = 'Unable to fetch daily tip.';
      }
}

function showLoadingAnimation() {
  document.querySelector("#paragraph").innerHTML = '<div class="loading-spinner"></div>';
}

function disableButton(isDisabled) {
  const paragraphButton = document.querySelector("#getNewParagraph");
  paragraphButton.disabled = isDisabled;
}

async function init() {
  try {
    const creds = await fetchCredentials();
    client = await createBedrockClient(creds);
    await fetchNewParagraph();
    await fetchNewTip();
  } catch (err) {
    console.error("Error initializing application:", err);
    document.querySelector("#paragraph").innerHTML = 'An error occurred while initializing the application.';
    document.querySelector("#tips").innerHTML = 'An error occurred while initializing the application.';
  }

  const paragraphButton = document.querySelector("#getNewParagraph");
  paragraphButton.addEventListener("click", fetchNewParagraph);
}

async function createBedrockClient(creds) {
  try {
    return new BedrockRuntimeClient({
      credentials: creds.credentials,
      region: creds.region,
    });
  } catch (err) {
    console.error("Error creating Bedrock client:", err);
    throw err;
  }
}

async function fetchCredentials() {
  return {
    region: "us-west-2",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  };
}

init();
