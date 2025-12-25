Uni402 — минималистичная веб-платформа, которая позволяет пользователю покупать доступ к 
отдельным урокам курсов за $0.01–$0.05 через протокол x402.

**How to build**

Frontend:

``cd frontend``
``docker build -f Dockerfile.frontend .``

**How to run**

Frontend:

``cd frontend``
``docker images``

From output command above copy id related to the last created image

``docker run -d -p 9000:82 --name frontend YOUR_IMAGE_ID``

Backend:

``docker compose up -d --build``