# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - heading "Service Requests" [level=1] [ref=e7]
        - paragraph [ref=e8]: View and manage assigned requests
      - generic [ref=e9]:
        - generic [ref=e10]:
          - heading "Service Requests" [level=2] [ref=e11]
          - button "Filters 1" [ref=e13] [cursor=pointer]:
            - img [ref=e14]
            - text: Filters
            - generic [ref=e16]: "1"
        - generic [ref=e18]:
          - img [ref=e19]
          - generic [ref=e21]:
            - heading "Error" [level=3] [ref=e22]
            - paragraph [ref=e23]: Failed to fetch requests
            - button "Try Again" [ref=e24] [cursor=pointer]
    - region "Notifications (F8)":
      - list
  - button [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - generic [ref=e33] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e34]:
      - img [ref=e35]
    - generic [ref=e38]:
      - button "Open issues overlay" [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]: "0"
          - generic [ref=e42]: "1"
        - generic [ref=e43]: Issue
      - button "Collapse issues badge" [ref=e44]:
        - img [ref=e45]
  - alert [ref=e47]
```