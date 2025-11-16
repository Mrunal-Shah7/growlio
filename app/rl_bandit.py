#Author:Mrunal Shah

import numpy as np

class BanditWeightOptimizer:

    def __init__(self, num_agents=5):
        self.num_agents = num_agents
        self.counts = np.zeros(num_agents) + 1e-8
        self.values = np.zeros(num_agents)

    def update(self, errors):
        """
        errors: list of forecast errors for each agent
        reward = -error
        """
        rewards = -np.array(errors)
        self.counts += 1
        self.values += (rewards - self.values) / self.counts  # running average

    def get_weights(self):
        """
        Softmax over learned values → weights
        """
        exp_vals = np.exp(self.values - np.max(self.values))
        return exp_vals / np.sum(exp_vals)
# ---::ms::--- end block