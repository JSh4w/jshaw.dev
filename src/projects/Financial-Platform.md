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
Frameworks/libraries - FastAPI, Vite, React, PostgreSQL, Modal, DuckDB, Azure Containers, Vercel
API's - Alpaca, Supabase, Trading212, Gocardless, Kraken

#### Background:
The platform aims to provide a completely tailored view of your finances with stock and portfolio analysis. By using gocardless api for bank data, T212 and snaptrade for brokerage accounts the user can view live stock streams and analysis which corresponds to their investment portfolio.

Analysis on stock data is being continually added such as sentiment analysis of market news, Hidden Markov Modelling to profile data into different regimes and simple trackers such as moving average.

The backend acts as the main platform which draws in market data using Alpaca API. It then processes market ticks into live 1-minute OHLCV data which can be accessed via SSE. Data is then stored locally in a DuckDB database in peristent storage and periodically upserted to a PostgreSQL database. Information is accessed via authentication via supabase.

The frontend acts as a way to visualise the live stock information, and gain access to current portfolio data. E.g Trading212 investments as well as current funds in bank accounts.



[View Source Code](https://github.com/JSh4w/financial_analyzer)
