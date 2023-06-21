import AS_PURCHASE from '@react-native-async-storage/async-storage';
export const STORAGE_KEYS = {
  IS_FULL_APP_PURCHASED: "@is_full_app_purchased",
}
export const storeBooleanData = async (key, value) => {

  try {
    const stringValue = value.toString()
    await AS_PURCHASE.setItem(key, stringValue)
  } catch (e) {
    console.log(e)
  }
}


export const getBooleanData = async key => {

  try {
    const value = await AS_PURCHASE.getItem(key)
    return value === "true"
  } catch (e) {
    console.log(e)
  }
}