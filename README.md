# Team Name: Team Data

# Wise Kitchen

From pantry to plate. Personalized meal planning built around the ingredients you already have.

---

## Overview

Wise Kitchen is a web application that helps you make the most of what's already in your kitchen. By keeping track of your pantry inventory and understanding your dietary preferences, it uses AI to suggest meals tailored specifically to you — cutting down on food waste and taking the guesswork out of what to cook.

When ingredients run low or run out, Wise Kitchen automatically adds them to a built-in grocery list so you always know what to pick up on your next trip. No more forgotten items, no more duplicate purchases.

## Features

- **Pantry Management** — Add groceries, track quantities, and keep your inventory up to date
- **Personalized Meal Suggestions** — Get AI-generated recipe ideas based on what you currently have, your cuisine preferences, dietary restrictions, and allergies
- **Nutritional Tracking** — Monitor calories, protein, and other nutritional goals alongside your meal plan
- **Smart Grocery List** — Automatically populated when items are running low, with the ability to manually add items as needed

## Tech Stack

- **Frontend:** React (Vite)
- **AI:** OpenAI API (GPT-4o-mini)
- **Storage:** localStorage
- **Language:** JavaScript

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/wise_kitchen.git
   cd wise_kitchen
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key
   ```
   VITE_OPENAI_API_KEY=your-key-here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Purpose

Wise Kitchen was built as part of a hackathon open track focused on sustainability and real-world impact. Food waste is a significant global issue — this project tackles it at the household level by helping people cook smarter with what they already own.