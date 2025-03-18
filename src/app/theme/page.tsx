"use client";
import React from "react";

export default function SolarizedDarkPreview() {
  return (
    <main
      // data-theme="solarized-dark"
      className="min-h-screen bg-base-100 text-base-content p-6"
    >
      <h1 className="text-3xl font-bold mb-4">Theme Preview</h1>

      {/* Buttons */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Buttons</h2>
        <div className="space-x-2">
          <button className="btn">Default</button>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
      </section>

      {/* Alerts / Toasts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Alerts</h2>
        <div className="alert">
          <span>Default alert!</span>
        </div>
        <div className="alert alert-info mt-2">
          <span>Info alert!</span>
        </div>
        <div className="alert alert-success mt-2">
          <span>Success alert!</span>
        </div>
        <div className="alert alert-warning mt-2">
          <span>Warning alert!</span>
        </div>
        <div className="alert alert-error mt-2">
          <span>Error alert!</span>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cards</h2>
        <div className="card w-64 bg-base-200 shadow-xl p-4">
          <div className="card-body">
            <h3 className="card-title">Card Title</h3>
            <p>This is some text inside the card.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Action</button>
            </div>
          </div>
        </div>
      </section>

      {/* Form inputs */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Form & Inputs</h2>
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text">Text Input</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered"
          />
        </div>
        <div className="form-control mb-2">
          <label className="label cursor-pointer">
            <span className="label-text">Checkbox</span>
            <input type="checkbox" className="checkbox" defaultChecked />
          </label>
        </div>
        <div className="form-control mb-2">
          <label className="label cursor-pointer">
            <span className="label-text">Radio Button 1</span>
            <input
              type="radio"
              name="radio-1"
              className="radio checked:bg-primary"
              defaultChecked
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Radio Button 2</span>
            <input
              type="radio"
              name="radio-1"
              className="radio checked:bg-primary"
            />
          </label>
        </div>
        <div className="form-control mb-2">
          <label className="label">
            <span className="label-text">Select Dropdown</span>
          </label>
          <select className="select select-bordered w-full max-w-xs">
            <option disabled>Pick an option</option>
            <option>Option A</option>
            <option>Option B</option>
            <option>Option C</option>
          </select>
        </div>
      </section>

      {/* Navbar */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Navbar</h2>
        <div className="navbar bg-base-200 rounded-box">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">My App</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>Theme Preview © 2025 - All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
