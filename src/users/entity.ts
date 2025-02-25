import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import {
  Membership,
  Profile,
  ProfileMetadata,
  ProspectData,
  Timestamp,
  UserType,
  ZapierConfig,
} from '@rentcheck/types';

@Entity({ name: 'users' })
export default class User implements Profile {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  email: string;

  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_type: UserType;

  @ApiProperty()
  phone_number?: string;

  fcm_tokens?: string[];

  @ApiProperty()
  temporary_password?: string;

  @ApiProperty()
  integration_token?: string;

  inspection_onboarding_shown_count: number;
  onboarding_shown_count: number;
  organizations: Membership[];
  paid: boolean;
  rating_shown_count: number;
  total_properties: number;
  zapier_config?: ZapierConfig;
  metadata?: ProfileMetadata;

  @ApiProperty()
  created_date?: Timestamp;

  feature_editing_dismissed?: boolean;
  prospect_data?: ProspectData;

  org_admin: boolean;
  internal_admin?: boolean;
  internal_sales?: boolean;

  skip_welcome_email?: boolean;
  company?: string;
}
