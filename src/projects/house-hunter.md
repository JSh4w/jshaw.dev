---
layout: project.njk
title: House Hunter
order: 3
brief: Python package combining web scraping, NLP and Google Sheets for automated property research.
github: https://github.com/JSh4w/House_hunter
image: /assets/SiteToSheet.png
tags: [python, web-scraping, nlp, google-sheets]
---

Python package that automates property research by scraping listings and outputting structured data to Google Sheets.

## Features

- **Smart Web Scraping**: Rate-limited requests respecting robots.txt with robust error handling
- **NLP Processing**: Extracts and standardizes information from varied listing formats
- **Google Sheets Integration**: Direct output to user-defined google sheets structures
- **Location Intelligence**: Google Distance Matrix API integration for commute time calculations

## Tech Stack

- **Scraping**: Beautiful Soup, Requests, Selenium
- **NLP**: NLTK, spaCy
- **Data**: NumPy, Pandas
- **APIs**: Google Sheets API, Google Distance Matrix API
