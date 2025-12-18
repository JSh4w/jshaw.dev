---
layout: project.njk
title: "Automated Financial Analysis Tool"
order: 1
brief: A Python application designed to automate fundamental stock analysis
github: https://github.com/JSh4w/financial_analyzer
image: /assets/financial_platform.png
tags: [python, DuckDB, PostgreSQL, T212, Alpaca finance, data-analysis]
---

# Financial Analyzer Python Application

## Architecture Overview
Languages - Python, Typescript, SQL 
Frameworks/libraries - FastAPI, Vite, React, PostgreSQL, Modal
API's - Alpaca, Supabase, Trading212, Gocardless

#### Background:
Expanding on previous time series analysis of stocks I wanted to make a platform I could interact with to test out new strategies, visualise graphs, and access financial information on the go. 

The backend acts as the main platform which draws in market data using Alpaca API and yfinance. It then processes market ticks into live 1-minute OHLCV data which can be accessed via SSE. Data is then stored locally in a DuckDB database in peristent storage and periodically upserted to a PostgreSQL database. Information is accessed via authentication via supabase.

The frontend acts as a way to visualise the live stock information, and gain access to current portfolio data. E.g Trading212 investments as well as current funds in bank accounts.

Locally I run backtesting scripts using the endpoints from my backend to get data. This has allowed others to do the same and build upon it. Once a script is running successfully, for instance a trivial example would be creating an ARMA graph. Then it is added as an endpoint to the backend platform. Anything more computationally intense like running finBERT is ran via Modal. This is a GPU infrastructure platform that outsources the compute with rapid cold-start up. 

[View Source Code](https://github.com/JSh4w/financial_analyzer)
