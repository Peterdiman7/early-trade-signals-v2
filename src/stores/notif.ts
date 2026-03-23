import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotifStore = defineStore('notif', () => {
  const subscriptions = ref<Set<string>>(new Set())

  try {
    const saved = JSON.parse(localStorage.getItem('ets_notif_subs') || '[]')
    saved.forEach((t: string) => subscriptions.value.add(t))
  } catch (e) {}

  function save() {
    try { localStorage.setItem('ets_notif_subs', JSON.stringify([...subscriptions.value])) } catch (e) {}
  }

  function toggleSubscription(ticker: string) {
    if (subscriptions.value.has(ticker)) subscriptions.value.delete(ticker)
    else subscriptions.value.add(ticker)
    save()
  }

  function isSubscribed(ticker: string) {
    return subscriptions.value.has(ticker)
  }

  return { subscriptions, toggleSubscription, isSubscribed }
})
