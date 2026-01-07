---
title: Moving from Heroku to GCP Cloud Run and App Engine - A startup's Dilemma in the early days
date: "2025-05-11T15:00:00.169Z"
featuredImage: ./img/heroku_to_gcp.png
description: Cost optimization is definitely not one of the things you should be focused on as an early stage startup yet to raise funds, still finding (PMF) product market fit. tech infrastructure scaling usually rings your door bell when the time is near, you however need to know when and how to respond.
category: ["tech"]
---

Cost optimization is definitely not one of the things you should be focused on as an early stage startup yet to raise funds, still finding (PMF) product market fit. The tech infrastructure scaling usually rings your door bell when the time is near, you however need to know when and how to respond.

Many Startups begins on a PaaS platform like Heroku, Netlify & Vercel etc due to their frictionless setup, but as your application grows, you might need more control and cost-effectiveness as these PaaS platform begins to rack up cost that are unsustainable.

At [ProteusAI](https://www.linkedin.com/company/proteusai/), the inital product and its services were all hosted on heroku for same reason as any other curious project starts, low overhead and zero worry about underlying tech infrastructure, you only want to validate your curiosity with tests and feedbak from prospective users. PS this is not a vibe-coded product, the code was not AI-generated and neither was AI involved the brainstorming of the initial release.

After a couple of successful demos and finally some decided to take the leap of faith and pay for the service as they found value in it to help them with their own product, we began to realise we need to increase the heroku dyno to serve these users or so we thought.

Thinking about architecting a scalabale product for a pre pre seed and proof of concept type of product is a fools errand and quite frankly a waste of everyone's time. A saying comes to mind about this and it goes thus; can't remeber where i read it from _`"A unit of risk it greater than a 100 unit of perfection"`_.

`The job of a startup is to validate or invalidate your risks in the early days as much as possible and as quick as possible.`

## Hitting Our Growth Pains

The cost of increasing our dynos for 6 services that powers the platform became unreasonable as we were bootstrapping, the first leap was to move the biggest workload to AWS container service. this was a relatively good short fix as we can benefit from auto-scaling and loadbalancing requests that comes in the service, did i hear someone ask about the cost? It was similar to heroku's with more value to gain from it without stressing over prices going up astronimically due to increased usage. A good friend of the house helped with the AWS setup putting everything on bare-metal to save cost as we grow, we only used services we needed.

Other services still lived on heroku at this point but they would be an overkill to have them on AWS as they was no need for it at this time. Fast forward to when we needed to have an SDK support which inturn requires a REST Service, we were back to oh heroku would work initially but now we're very aware that this API would be used as much as the graphql service we deployed earlier, therein comes moving to GCP cloud run and app engine managed services.

## The Breaking Point

Our journey with Heroku had been smooth sailing until we hit that critical point where costs started climbing faster than revenue. With 6 services running and each requiring its own dyno, our monthly infrastructure bill was becoming a significant portion of our operational costs (not like we had much operational cost 😅). The decision to move wasn't just about cost - it was about sustainable scaling. I'd say the real trigger points for us were:

- Seeing those monthly charges keep climbing while we were still bootstrapping
- Realizing our customers needed better performance than what we could affordably give them on Heroku
- Getting tired of the occasional cold start issues

## Why we picked GCP Cloud Run & App Engine

After our experience with AWS Container Service, we knew containerization was the way forward. GCP's offering caught our attention for several reasons:

1. **Pay-per-use Model**: Cloud Run only charges for actual compute time, not idle containers
2. **Zero Cold Starts**: For our API services, this was crucial
3. **Simple Deployment**: Much like Heroku, but with better control
4. **Regional Deployment**: Ability to serve users from multiple regions without complex setup

`To add to the list, we had a GCP credit for startup and that made the decision easier to make including the superior UX of the GCP platform compared to AWS.`

Let's be real - those startup credits matter when you're watching every dollar! The AWS console felt like navigating through the 90s web compared to GCP's clean interface. Sometimes it's these small things that tip the scale.

## The Migration Process

### Step 1: Service Assessment

We categorized our services based on resource usage:

- High-traffic GraphQL & REST API → Cloud Run
- Background workers → Cloud Run
- Static web apps → App Engine
- Low-traffic REST endpoints → App Engine

### Step 2: Containerization

For Cloud Run services, we needed Dockerfiles. Here's a basic example:

```dockerfile
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile

COPY . .
COPY src ./src

RUN yarn run build

EXPOSE 8080

CMD yarn start

```

Nothing fancy here - just a straightforward Docker setup that works. The Alpine image kept things lightweight.

### Step 3: CI/CD Setup

We used GitHub Actions for automated deployments:

```yaml
name: Deploy to Google Cloud Run

on:
  push:
    branches:
      - staging

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: europe-west4
  IMAGE_TAG: ${{ github.sha }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Required for OIDC authentication
    steps:
      - name: Checkout source
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      # Generate a .env.staging file from GitHub Variables
      - name: Generate config file
        if: github.ref == 'refs/heads/staging'
        run: |
          envsubst < service.stage.yaml > service.staging.yaml
            echo "Generated config:"
            cat service.staging.yaml
        env: ...

      - name: Build Service
        run: |
          yarn install
          yarn run build

      - name: Build Docker Image
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/...:${{ github.sha }} .

      - id: "auth"
        uses: "google-github-actions/auth@v2"
        with:
          create_credentials_file: "true"
          workload_identity_provider: "${{ secrets.GCP_WORKLOAD_ID_PROVIDER }}"
          service_account: "${{ secrets.GCP_SERVICE_ACCOUNT }}"

      - name: Configure Docker for Google Cloud
        run: gcloud auth configure-docker

      - name: Push Docker image
        run: |
          docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/...:${{ github.sha }}

      - name: Deploy to Cloud Run Prod
        if: github.ref == 'refs/heads/staging'
        run: |
          gcloud run services replace service.staging.yaml \
            --region $REGION \
            --platform managed
```

Setting this up took some trial and error, but once it was working, deployments became completely hands-off. Push to staging, main, and boom - new version deployed.

## Cost Analysis

### Before Migration (Monthly)

- Heroku Dynos (6 services) at $25-$50 per standard dyno is between $150 - $250 monthly for us excluding external services like Atlas, pincone, emails etc.

### After Migration (Monthly)

- Cloud Run (3 services), App Engine (3 services) all on per usage billing including Artifact Registery for the docker images was 70% less than heroku's base standard plan for 6 services.

A quick 70% reduction in our monthly infrastructure costs!

## Performance Improvements

Beyond cost savings, we saw:

- faster API response times
- Zero cold starts for critical endpoints
- Better observability with Cloud Monitoring
- Simplified deployment process with much more control

## Lessons Learned

1. **Start Small**: We migrated one service at a time
2. **Test Thoroughly**: Each service had a staging deployment
3. **Monitor Everything**: Set up proper monitoring before migration
4. **Document Changes**: Keep team aligned on new deployment processes

there were a couple of late nights during the migration when things broke in unexpected ways. That's just part of the game. The important part is we came out the other side with a much more stable and cost-effective setup.

## When Should You Consider Moving?

Consider GCP Cloud Run and App Engine (or similar services) when:

- Monthly infrastructure costs exceed $200
- You need better scaling controls
- Cold starts are affecting user experience
- You're comfortable with containers
- Regional deployment becomes necessary

Don't rush into this too early, though. If you're still figuring out if anyone even wants your product, stick with the simplest thing that works. Premature optimization is still the root of all evil in startups.

## Parting Thoughts

For early-stage startups, moving from Heroku to GCP might seem daunting, but the long-term benefits are worth it. Our 70% cost reduction allowed us to reinvest in product development rather than infrastructure. The key is timing - don't optimize too early, but don't wait until costs become unsustainable.

If you're at that inflection point where Heroku is starting to hurt your wallet, I've been there. The migration isn't as scary as it seems, and the benefits are real. Feel free to reach out if you're considering a similar move - happy to share more details about our experience or answer questions about your specific setup.

Every startup's journey is different, but all of us face the same challenge at some point: balancing the ease of managed platforms with the need for cost-effective scaling. The trick is knowing when to make the leap.

## Resources

- [GCP Cloud Run Documentation](https://cloud.google.com/run/docs)
- [App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Container Migration Guide](https://cloud.google.com/solutions/migrating-containers-to-cloud-run)

Feel free to reach out if you're considering a similar move. The journey might be different for your use case, but the principles remain the same. Trust me, your runway will thank you!
