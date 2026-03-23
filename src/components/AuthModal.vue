<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="auth-modal fade-up">
            <div class="modal-header">
                <div class="brand">
                    <span>⚡</span>
                    <span class="font-display">EarlyTrade</span>
                </div>
                <button class="close-btn" @click="$emit('close')">✕</button>
            </div>

            <!-- Tabs -->
            <div class="auth-tabs">
                <button :class="['tab', { active: activeTab === 'register' }]"
                    @click="activeTab = 'register'">Register</button>
                <button :class="['tab', { active: activeTab === 'login' }]" @click="activeTab = 'login'">Login</button>
            </div>

            <!-- Register Form -->
            <form v-if="activeTab === 'register'" class="auth-form" @submit.prevent="handleRegister">
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name</label>
                        <input v-model="form.firstName" type="text" placeholder="Alex" required />
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input v-model="form.lastName" type="text" placeholder="Trader" required />
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" placeholder="you@example.com" required />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="form.password" type="password" placeholder="••••••••" required minlength="6" />
                </div>
                <button type="submit" class="btn-submit" :disabled="loading">
                    <span v-if="loading" class="spinner" />
                    <span v-else>Register for free →</span>
                </button>
                <p v-if="error" class="form-error">{{ error }}</p>
            </form>

            <!-- Login Form -->
            <form v-else class="auth-form" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" placeholder="you@example.com" required />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="form.password" type="password" placeholder="••••••••" required />
                </div>
                <button type="submit" class="btn-submit" :disabled="loading">
                    <span v-if="loading" class="spinner" />
                    <span v-else>Login →</span>
                </button>
                <p v-if="error" class="form-error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const activeTab = ref(props.mode)

watch(() => props.mode, (v) => { activeTab.value = v })

const loading = ref(false)
const error = ref('')

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
})

async function handleRegister() {
    error.value = ''
    loading.value = true
    try {
        await authStore.register(form.value.firstName, form.value.lastName, form.value.email, form.value.password)
        emit('success')
    } catch (e) {
        error.value = 'Registration failed. Please try again.'
    } finally {
        loading.value = false
    }
}

async function handleLogin() {
    error.value = ''
    loading.value = true
    try {
        await authStore.login(form.value.email, form.value.password)
        emit('success')
    } catch (e) {
        error.value = 'Invalid credentials. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 12, 20, 0.85);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    padding: 0;
}

.auth-modal {
    width: 100%;
    background: var(--et-surface);
    border-top: 1px solid var(--et-border);
    border-radius: 20px 20px 0 0;
    padding: 24px 24px 48px;
    max-height: 92vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 18px;
}

.close-btn {
    background: var(--et-surface-3);
    border: none;
    color: var(--et-text-secondary);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
}

/* Tabs */
.auth-tabs {
    display: flex;
    background: var(--et-surface-2);
    border-radius: 10px;
    padding: 3px;
    margin-bottom: 24px;
}

.tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    color: var(--et-text-muted);
    border-radius: 8px;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
}

.tab.active {
    background: var(--et-surface);
    color: var(--et-text-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* Form */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--et-text-secondary);
}

.form-group input {
    background: var(--et-surface-2);
    border: 1px solid var(--et-border);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 15px;
    color: var(--et-text-primary);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.18s;
    width: 100%;
}

.form-group input:focus {
    border-color: var(--et-accent);
}

.form-group input::placeholder {
    color: var(--et-text-muted);
}

.btn-submit {
    width: 100%;
    padding: 14px;
    background: var(--et-accent);
    border: none;
    border-radius: 10px;
    color: #080c14;
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-submit:not(:disabled):hover {
    filter: brightness(1.1);
}

.form-error {
    color: var(--et-sell);
    font-size: 13px;
    text-align: center;
    margin: 0;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(8, 12, 20, 0.3);
    border-top-color: #080c14;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>