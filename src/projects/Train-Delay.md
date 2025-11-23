---
layout: project.njk
title: "Train Delay Web Application"
order: 4
brief: A Python FastAPI backend and React frontend application that analyzes historical UK train performance data with AI-powered insights.
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
I was motivated to build this tool after experiencing frequent train delays without having access     
to historical performance data to plan journeys better. Existing platforms like National Rail show    
live updates but lack comprehensive historical analysis, making it difficult to choose optimal       
travel times.

This project integrates with the UK Historical Service Performance (HSP) API to fetch delay data      
across any route, then visualizes departure and arrival performance through interactive
histograms. The AI component (OpenAI) provides travel recommendations based on the statistical        
patterns.

Key features include intelligent caching to avoid repeated API calls, station code autocomplete       
for all UK stations, and streaming progress updates for long-running analyses. The histogram
breakdown shows on-time rates, early arrivals, and various delay buckets to help commuters make       
informed decisions.

[View Source Code](https://github.com/jsh4w/hackathon)