class CustomQueue<T> {
  private queue: T[] = [];

  // Insert at the end (normal enqueue)
  enqueue(item: T): void {
    this.queue.push(item);
  }

  // Remove from the front (normal dequeue)
  dequeue(): T | undefined {
    return this.queue.shift();
  }

  // Insert at a specific index
  insertAt(index: number, item: T): void {
    if (index < 0 || index > this.queue.length) {
      throw new Error("Index out of bounds");
    }
    this.queue.splice(index, 0, item);
  }

  // View front element
  peek(): T | undefined {
    return this.queue[0];
  }

  // Get queue as array (for inspection)
  toArray(): T[] {
    return [...this.queue];
  }

  // Optional: Get current size
  size(): number {
    return this.queue.length;
  }
}

export default CustomQueue
