import * as cdk8s from 'cdk8s';
import * as constructs from 'constructs';
import * as kplus from 'cdk8s-plus-20';
import { PROW_NAMESPACE, PROW_JOB_NAMESPACE } from '../test-ci-stack';

export interface ProwSecretsChartProps {
  readonly botPersonalAccessToken: string;
  readonly webhookHMACToken: string;
}

export class ProwSecretsChart extends cdk8s.Chart {
  readonly botPATSecret: kplus.Secret;
  // github token to be used by prowjobs in PROW_JOB_NAMESPACE
  readonly prowjobBotPATSecret: kplus.Secret;
  readonly webhookHMACSecret: kplus.Secret;

  constructor(scope: constructs.Construct, id: string, props: ProwSecretsChartProps) {
    super(scope, id);

    if (props.botPersonalAccessToken === undefined || props.webhookHMACToken === undefined) {
      throw new Error(`Expected bot personal access token and webhook HMAC token to be specified`);
    }

    this.botPATSecret = new kplus.Secret(this, 'github-token', {
      stringData: {
        'token': props.botPersonalAccessToken
      },
      metadata: {
        name: 'github-token',
        namespace: PROW_NAMESPACE
      }
    });

    this.prowjobBotPATSecret = new kplus.Secret(this, 'prowjob-github-token', {
      stringData: {
        'token': props.botPersonalAccessToken
      },
      metadata: {
        name: 'prowjob-github-token',
        namespace: PROW_JOB_NAMESPACE
      }
    });

    this.webhookHMACSecret = new kplus.Secret(this, 'hmac-token', {
      stringData: {
        'hmac': props.webhookHMACToken
      },
      metadata: {
        name: 'hmac-token',
        namespace: PROW_NAMESPACE
      }
    });
  }
}