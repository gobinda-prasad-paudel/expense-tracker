declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf"

  interface AutoTableOptions {
    startY?: number
    head?: string[][]
    body?: string[][]
    theme?: string
    headStyles?: Record<string, unknown>
    bodyStyles?: Record<string, unknown>
    alternateRowStyles?: Record<string, unknown>
    columnStyles?: Record<string, unknown>
    margin?: Record<string, number>
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void

  export default autoTable
}
