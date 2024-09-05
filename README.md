# ArticleChat

ArticleChat is an intelligent chatbot that processes and interacts with content from news articles and web pages. By leveraging advanced Natural Language Processing (NLP) models and a FAISS-based vector search system, ArticleChat provides context-aware responses to user inquiries about the content of the articles.

![image](https://github.com/user-attachments/assets/8067ea6a-576a-48f9-8db0-d81945cfe00e)


![image](https://github.com/user-attachments/assets/196554ad-c17d-445b-ac05-91c5b9ae8c38)


## Features

- **Article Processing**: Fetch and parse content from a list of URLs, including handling JavaScript-rendered pages.
- **Text Chunking and Embedding**: Split article content into manageable chunks and generate vector embeddings using `sentence-transformers`.
- **FAISS Vector Search**: Efficiently retrieve relevant content using FAISS, a fast similarity search engine for embeddings.
- **GroqChat Integration**: Answer questions about processed articles using GroqChat's language model.
- **React Frontend**: A user-friendly chatbot interface for interacting with the processed article content.

## Technology Stack

- **Backend**:
  - Flask: Backend framework for handling API requests.
  - FAISS: For vector similarity search.
  - PyTorch: For working with transformer models.
  - Transformers: Pre-trained models for embedding generation.
  - LangChain: For managing prompt templates and memory.
  - BeautifulSoup & Selenium: For web scraping.
  - Newspaper3k: For parsing news articles.

- **Frontend**:
  - React: Frontend framework for the chatbot UI.
  - HTML/CSS: For styling the user interface.
  - Fetch API: To interact with the Flask backend.

## Setup Instructions

### Backend

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Alok-kumar123/NewsArticleAnalysis.git
   cd articlechat
   
