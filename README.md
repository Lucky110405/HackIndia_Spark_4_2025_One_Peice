---
license: mit
datasets:
- Ymak7/transactional-data
language:
- en
---

# HAMI AML Detector 🕵️‍♂️🚨

## Overview
HAMI AML Detector is a powerful graph neural network (GNN) based solution designed for real-time **Anti-Money Laundering (AML)** transaction monitoring. The model dynamically builds transaction graphs and detects suspicious transaction patterns such as:

- **Fan-In**
- **Fan-Out**
- **Cycle**
- **Scatter-Gather**
- **Gather-Scatter**
- and more...

## How it Works
1. **Transaction Graph Construction**
   - Transactions are represented as nodes and edges in real-time.
   - Dynamically clusters transactions based on shared accounts.

2. **Graph Attention Network (GAT)**
   - Uses attention mechanisms to learn important transaction patterns.
   - Classifies each transaction cluster as "AML" or "Normal."

3. **Real-Time Monitoring**
   - Integrates seamlessly with Kafka for real-time AML detection.
   - Continuously updates and evaluates transaction networks.

## Intended Use
- Real-time fraud and AML monitoring by financial institutions.
- Enhanced accuracy in identifying and mitigating financial crimes.

## Frameworks & Technologies
- **PyTorch**
- **PyTorch Geometric**
- **Kafka** (for real-time integration)
- **NetworkX** (for graph management)

## Performance
The model shows excellent capability in detecting sophisticated AML patterns with high accuracy on simulated transaction datasets. A full performance analysis including confusion matrices and accuracy metrics is provided in the repository.

## How to use the model
Please visit the repository for detailed instructions:
```bash
git clone https://huggingface.co/Ymak7/HAMI-AML-DETECTOR