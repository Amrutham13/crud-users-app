const API = 'https://crud-users-app-o0vv.onrender.com/api';

// =========================================================
// Tabs
// =========================================================

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// =========================================================
// Toast helper
// =========================================================

function toast(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => (el.className = 'toast'), 3000);
}

// =========================================================
// READ - Load all users
// =========================================================

async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    const list = document.getElementById('usersList');
    const badge = document.getElementById('countBadge');

    if (!data.success || data.data.length === 0) {
      list.innerHTML = '<div class="empty">No users yet.</div>';
      badge.textContent = '0';
      return;
    }

    badge.textContent = data.data.length;
    list.innerHTML = data.data
      .map(
        u => `
        <div class="user-row">
          <div class="user-id">#${u.id}</div>
          <div>
            <div class="user-name">${u.name}</div>
            <div class="user-msg">${u.message}</div>
          </div>
        </div>
      `
      )
      .join('');
  } catch {
    document.getElementById('usersList').innerHTML =
      '<div class="empty">Could not connect to server.</div>';
  }
}

// =========================================================
// CREATE
// =========================================================

document.getElementById('createBtn').addEventListener('click', async () => {
  const name = document.getElementById('c-name').value.trim();
  const message = document.getElementById('c-message').value.trim();

  if (!name || !message) {
    return toast('c-toast', 'Name and message required.', 'error');
  }

  try {
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    const data = await res.json();

    if (res.ok) {
      toast('c-toast', 'User created.', 'success');
      document.getElementById('c-name').value = '';
      document.getElementById('c-message').value = '';
      loadUsers();
    } else {
      toast('c-toast', data.error || 'Failed.', 'error');
    }
  } catch {
    toast('c-toast', 'Server unreachable.', 'error');
  }
});

// =========================================================
// UPDATE
// =========================================================

document.getElementById('updateBtn').addEventListener('click', async () => {
  const id = document.getElementById('u-id').value.trim();
  const name = document.getElementById('u-name').value.trim();
  const message = document.getElementById('u-message').value.trim();

  if (!id || !name || !message) {
    return toast('u-toast', 'All fields required.', 'error');
  }

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    const data = await res.json();

    if (res.ok) {
      toast('u-toast', 'User updated.', 'success');
      document.getElementById('u-id').value = '';
      document.getElementById('u-name').value = '';
      document.getElementById('u-message').value = '';
      loadUsers();
    } else {
      toast('u-toast', data.error || 'Failed.', 'error');
    }
  } catch {
    toast('u-toast', 'Server unreachable.', 'error');
  }
});

// =========================================================
// DELETE
// =========================================================

document.getElementById('deleteBtn').addEventListener('click', async () => {
  const id = document.getElementById('d-id').value.trim();

  if (!id) {
    return toast('d-toast', 'Enter a user ID.', 'error');
  }

  if (!confirm(`Delete user #${id}?`)) return;

  try {
    const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      toast('d-toast', 'User deleted.', 'success');
      document.getElementById('d-id').value = '';
      loadUsers();
    } else {
      toast('d-toast', data.error || 'Failed.', 'error');
    }
  } catch {
    toast('d-toast', 'Server unreachable.', 'error');
  }
});

// =========================================================
// Init
// =========================================================

loadUsers();