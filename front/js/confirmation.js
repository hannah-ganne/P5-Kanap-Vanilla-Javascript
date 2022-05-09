'use strict';

const orderIdEl = document.getElementById('orderId');

// get the order ID
let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get('id');

// Update DOM (display order ID)

orderIdEl.textContent = orderId;