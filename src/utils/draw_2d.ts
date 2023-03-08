export function drawPlaceholderText(
  text: string,
  context?: CanvasRenderingContext2D,
) {
  if (context) {
    context.clearRect(
      0, 0,
      context.canvas.width, context.canvas.height
    )

    context.fillStyle = `rgba(0, 0, 0, 1)`
    context.font = '24px Arial'
    context.textAlign = 'center'
    context.fillText(text, context.canvas.width / 2, context.canvas.height / 2)
  }
}