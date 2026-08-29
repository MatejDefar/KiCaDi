<template>
  <RouterView />
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0ebe3;
  color: #2c2c2c;
}

:root {
  --primary: #c1432a;
  --primary-hover: #a33520;
  --background: #f0ebe3;
  --card-bg: #ffffff;
  --text-muted: #888;
  --border: #e0d9d0;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}
.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: #2c2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}
.btn-secondary:hover {
  background-color: #444;
}

.btn-outline {
  background-color: transparent;
  color: #2c2c2c;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}
.btn-outline:hover {
  border-color: #999;
}

.input-field {
  width: 100%;
  padding: 13px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: white;
  outline: none;
  transition: border 0.2s;
}
.input-field:focus {
  border-color: var(--primary);
}

.greska-poruka {
  color: var(--primary);
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
}

.kartica {
  background: var(--card-bg);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
