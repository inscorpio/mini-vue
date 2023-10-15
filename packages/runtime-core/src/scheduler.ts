// 优化创建多个 Promise
// 如果不处理多个更新任务将在多个微任务中执行
// 处理后将在一个微任务中执行所有更新任务
let isFlushing = false
const queue = []
const p = Promise.resolve()

export function queueJob(job) {
  !queue.includes(job) && queue.push(job)

  queueFlush()
}

function queueFlush() {
  if (isFlushing)
    return
  isFlushing = true
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushing = false

  queue.forEach(job => job())
}

export function nextTick(fn) {
  return fn
    ? p.then(fn)
    : p
}
