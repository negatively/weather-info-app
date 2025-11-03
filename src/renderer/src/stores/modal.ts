import { reactive, readonly } from 'vue'

export interface ModalData {
  imageUrl?: string
  prompt?: string
  [key: string]: any
}

// Define the overall modal state shape
interface ModalState {
  isOpen: boolean
  currentModal: string | null
  modalData: ModalData
}

// Create the reactive state
const state = reactive<ModalState>({
  isOpen: false,
  currentModal: null,
  modalData: {}
})

// Action functions
export function openModal(name: string, data: ModalData = {}): void {
  state.currentModal = name
  state.modalData = data
  state.isOpen = true
}

export function closeModal(): void {
  state.isOpen = false
  state.currentModal = null
  state.modalData = {}
}

// Hook to consume the state in components
export function useModal() {
  // readonly() ensures outside components can’t mutate state directly
  return readonly(state)
}
