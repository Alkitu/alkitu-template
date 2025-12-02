# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - heading "Work Locations" [level=2] [ref=e7]
          - paragraph [ref=e8]: Manage your work locations for service requests
        - button "Add Location" [ref=e9] [cursor=pointer]:
          - img [ref=e10]
          - text: Add Location
      - generic [ref=e11]:
        - img [ref=e12]
        - generic [ref=e14]: "ThrottlerException: Too Many Requests"
      - generic [ref=e15]:
        - img [ref=e17]
        - heading "No locations yet" [level=3] [ref=e20]
        - paragraph [ref=e21]: Get started by adding your first work location.
        - button "Add Your First Location" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
          - text: Add Your First Location
    - region "Notifications (F8)":
      - list
  - button [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - button "Open Next.js Dev Tools" [ref=e33] [cursor=pointer]:
    - img [ref=e34]
  - alert [ref=e37]
```