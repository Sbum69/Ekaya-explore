# Ekaya Explore 
### Community-Driven Smart Tourism Platform for Mozambique

> Discover authentic destinations, support local communities, and explore culture through an offline-first travel platform.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![PWA](https://img.shields.io/badge/PWA-offline--first-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

# Table of Contents

- Vision
- Problem
- Solution
- Core Features
- Frontend Stack
- Backend Technology Stack
- Architecture Overview
- Project Structure
- Quick Start
- Environment Variables
- Scripts
- Deployment
- Scalability Roadmap
- Product Roadmap
- Social Impact
- Contributing
- License

---

# Vision

**Ekaya Explore** is a community-first tourism platform designed for Mozambique, combining:

- Offline travel guides  
- Community storytelling  
- Local business discovery  
- Smart itineraries  
- Maps and geolocation  
- Bookings and experiences  
- Gamified exploration

Its mission is to make tourism more inclusive, sustainable, and accessible.

---

# Problem

Tourism in Mozambique faces major challenges:

- Tourists arrive with fragmented information  
- Small local businesses are invisible  
- Communities struggle to tell their own stories  
- Mobile internet is expensive and unreliable  
- Authentic destinations are under-promoted  

---

# Solution

Ekaya Explore provides a unified platform where travelers can:

## Offline Pocket Guide

- Destination maps
- Routes and itineraries
- Transport information
- Safety guidance
- Offline access

---

## Community Experiences

- Cultural stories
- Community-led experiences
- Local traditions
- Events and heritage

---

## Local Business Marketplace

- Guides
- Guesthouses
- Cooperatives
- Artisans
- Community tourism operators

---

## Exploration Gamification

- Missions
- Badges
- Challenges
- Community-impact quests

---

# Core Features

## For Travelers

- Offline-first exploration
- Smart itineraries
- Bookings
- Location-based discovery
- Cultural storytelling

## For Communities

- Publish experiences
- Promote businesses
- Generate income
- Preserve heritage

---

# Frontend Stack

| Layer | Technology |
|------|-------------|
Frontend | React 18 + Vite |
State | Zustand + IndexedDB |
Styling | Tailwind CSS |
Maps | Leaflet / Mapbox |
Routing | React Router |
PWA | Workbox |
i18n | i18next |
Testing | Vitest + RTL |

---

# Backend Technology Stack

---

# Core Runtime & Framework

## Node.js

Chosen because the platform is heavily I/O driven:

- bookings  
- maps  
- APIs  
- real-time updates  

Node handles concurrent requests efficiently without blocking.

---

## Express.js

Simple and flexible backend framework ideal for:

- fast MVP development  
- MERN compatibility  
- lightweight architecture  
- future scalability

---

# Database

## MongoDB Atlas

Perfect for highly dynamic data:

- itineraries with variable structures  
- user-generated content  
- business listings  
- reviews and ratings  

Benefits:

- flexible document model  
- no complex joins  
- rapid iteration  
- managed scalability via Atlas

---

# Real-Time Communication

## Socket.io

Used for:

- live booking updates  
- notifications  
- activity feeds  
- social interactions

Persistent connections improve user experience dramatically.

---

# Authentication & Authorization

## JWT

Stateless authentication suitable for distributed systems.

---

## OAuth 2.0

Providers:

- Google
- Apple

One-tap login reduces onboarding friction for travelers.

---

# File Storage & Media

## AWS S3 or Cloudinary

Used for:

- user photos
- business images
- videos

### Cloudinary

Best for:

- image optimization  
- transformations  
- compression

### S3

Best for:

- lower cost at scale  
- flexibility  
- storage-heavy workloads

---

# Maps & Geolocation

## Mapbox (Preferred)

Reasons:

- customizable UI  
- lower cost at scale  
- custom routing  
- better offline support

Alternative:

- Google Maps API

---

# Payments

## Stripe

Supports:

- premium subscriptions  
- bookings  
- commission handling

Developer-friendly and highly scalable.

---

# Search Layer

## Elasticsearch

Later-stage scalable search for:

- “near me” discovery  
- multi-filter search  
- relevance ranking  
- geospatial queries

---

# Caching

## Redis

Use cases:

- caching popular routes  
- sessions  
- frequently accessed data

Improves performance and reduces database load.

---

# Background Processing

## BullMQ

Async jobs:

- emails  
- booking workflows  
- notifications  
- analytics updates

Improves responsiveness and reliability.

---

# DevOps & Deployment

## Docker

Ensures consistency across:

- development  
- staging  
- production

---

## Deployment

### MVP

- Render
- Railway

### Scale

- AWS EC2
- S3
- ECS
- CloudFront

---

# Architecture Overview

```text
Client (React PWA)
   |
API Gateway
   |
Express Backend
├── Auth Service
├── Booking Service
├── Community Content
├── Business Listings
├── Realtime Service
└── Search Layer

Data:
MongoDB Atlas

Cache:
Redis

Queue:
BullMQ

Storage:
S3 / Cloudinary
```

---

# Project Structure

```bash
ekaya-explore/

backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── sockets/
│   ├── jobs/
│   └── utils/

frontend/
├── src/
├── public/

docs/
README.md
ROADMAP.md
docker-compose.yml
```

---

# Quick Start

## Requirements

- Node >=20
- Docker
- MongoDB Atlas
- Redis

---

## Clone

```bash
git clone https://github.com/yourusername/ekaya-explore.git

cd ekaya-explore
```

---

## Install

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

REDIS_URL=

STRIPE_SECRET=

MAPBOX_TOKEN=

AWS_ACCESS_KEY=

AWS_SECRET_KEY=

CLOUDINARY_URL=
```

---

# Scripts

```bash
npm run dev

npm run build

npm run test

npm run lint

npm run docker:up
```

---

# Scalability Roadmap

## Phase 1 — MVP

- Offline guide  
- Maps  
- Local business listings  
- Community content  
- Itineraries

---

## Phase 2

- Bookings  
- Payments  
- Gamification  
- Profiles  
- Reviews

---

## Phase 3

- Elasticsearch  
- Recommendation engine  
- Social features  
- National expansion

---

# Why This Stack?

Chosen for:

✅ Low MVP cost  
✅ Fast development  
✅ Scalable architecture  
✅ Works for low-connectivity markets  
✅ Adapted for African realities

---

# Social Impact

Ekaya Explore is not just software.

It is digital infrastructure for:

- sustainable tourism  
- community income  
- cultural preservation  
- local economic inclusion

---

# Contributing

Contributions welcome.

```bash
Fork

Create branch

Commit changes

Push

Open PR
```

---

# Future Improvements

Potential future additions:

- Microservices architecture  
- Kubernetes  
- Event-driven architecture  
- AI recommendations  
- Smart tourism analytics

---

# License

MIT

---

## Author

Diogo Ribeiro

---

## Vision Statement

> Technology that works.  
> Tourism that transforms.  
> Communities with a voice.