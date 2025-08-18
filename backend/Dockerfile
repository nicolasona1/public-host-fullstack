FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (optional but good for pandas/openpyxl performance)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose the port expected by most hosts
ENV PORT=8080
EXPOSE 8080

# Gunicorn serves the Flask app from wsgi:app
CMD ["gunicorn", "-w", "3", "-b", "0.0.0.0:8080", "wsgi:app"]
