import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export type OrderFirestoreDTO = {
  asset: string
  description: string
  status: 'open' | 'closed'
  solution?: string
  created_at: FirebaseFirestoreTypes.Timestamp
  closed_at?: FirebaseFirestoreTypes.Timestamp
  priority: 'baixa' | 'média' | 'alta'
  userId?: string
}
