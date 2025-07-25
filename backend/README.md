# Setup

## 1. Create & activate a virtual environment

```bash
python3 -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

## 2. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 3. Configure environment variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the information

## 4. Apply database migrations

```bash
python manage.py migrate
```

## 5. Run the development server

```bash
python manage.py runserver
```

Then visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.
