import { ref } from 'vue'
import { loadData, saveData, nextId } from '../services/storage'

export function useCrud(resource) {
  const items = ref(loadData(resource))

  const persist = () => saveData(resource, items.value)

  function add(data) {
    const item = { ...data, id: nextId(items.value) }
    items.value.unshift(item)
    persist()
    return item
  }

  function update(id, data) {
    const index = items.value.findIndex(item => Number(item.id) === Number(id))
    if (index === -1) return false
    items.value[index] = { ...items.value[index], ...data, id: items.value[index].id }
    persist()
    return true
  }

  function remove(id) {
    items.value = items.value.filter(item => Number(item.id) !== Number(id))
    persist()
  }

  return { items, add, update, remove, persist }
}
