---
layout: project.njk
title: "Train Delay Web Application"
order: 4
brief: A Python FastAPI backend and React frontend application that analyzes historical UK train performance data with AI-powered insights.
link: https://trelay.netlify.app/
github: https://github.com/jsh4w/hackathon
image: /assets/trelay.png
tags: [react, python, fastapi, openai, sqlite, data-analysis, transportation]
---

# trelay - Railway Journey Analysis Platform

## Architecture Overview
Frontend - React 19
Backend - Python & FastAPI
Database - SQLite (caching)
AI Integration - OpenAI GPT

#### Background:
I was motivated to build this tool after experiencing frequent train delays on the way to work.
Initially as part of a hackathon and now as a developed project I wanted a way to search a particular route
and generate histograms of delays for departure and arrival times.

This project integrates with the UK Historical Service Performance (HSP) API to fetch delay data      
across any route, then visualizes departure and arrival performance through interactive
histograms. The AI component (OpenAI) provides travel recommendations based on the statistical        
patterns - which is currently deactivated for cost reasons.

Data is cached for re-calling specific journeys but otherwise ephemerel and limited to a few GB. Once the backend is called there is station code autocomplete. This converts suggested names into the required station codes which HSP works on.
The histogram breakdown shows on-time rates, early arrivals, and various delay buckets to help commuters make
informed decisions.

[View Source Code](https://github.com/jsh4w/hackathon)