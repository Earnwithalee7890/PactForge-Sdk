import { StacksNetwork, STACKS_MAINNET } from '@stacks/network';
import { PactsModule } from './modules/pacts';
import { MilestonesModule } from './modules/milestones';
import { ArbitrationModule } from './modules/arbitration';
import { ReputationModule } from './modules/reputation';
import { TokenModule } from './modules/token';

export class PactForgeClient {
  public network: StacksNetwork;
  public pacts: PactsModule;
  public milestones: MilestonesModule;
  public arbitration: ArbitrationModule;
  public reputation: ReputationModule;
  public token: TokenModule;

  constructor(network?: StacksNetwork) {
    // Default to mainnet as that is where the contracts are deployed
    this.network = network || STACKS_MAINNET;
    
    this.pacts = new PactsModule(this.network);
    this.milestones = new MilestonesModule(this.network);
    this.arbitration = new ArbitrationModule(this.network);
    this.reputation = new ReputationModule(this.network);
    this.token = new TokenModule(this.network);
  }

  public setNetwork(network: StacksNetwork) {
    this.network = network;
    this.pacts = new PactsModule(network);
    this.milestones = new MilestonesModule(network);
    this.arbitration = new ArbitrationModule(network);
    this.reputation = new ReputationModule(network);
    this.token = new TokenModule(network);
  }
}
