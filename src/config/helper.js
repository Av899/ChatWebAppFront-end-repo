export function timeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = Math.floor(diffInMs / 1000);

  const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
          return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
  }

  return 'Just now';
}

// Usage examples:
console.log(timeAgo(new Date()));                     // Just now
console.log(timeAgo(new Date(Date.now() - 30000)));    // 30 seconds ago
console.log(timeAgo(new Date(Date.now() - 7200000)));  // 2 hours ago
console.log(timeAgo(new Date(Date.now() - 259200000)));// 3 days ago
console.log(timeAgo('2023-01-01'));                    // X time ago based on current date