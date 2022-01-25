import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodeMailerStub from 'nodemailer-stub';
import { stubTransport } from 'nodemailer-stub';
import * as nodeMailer from 'nodemailer';

const mockMailService = {
  lastMail: jest
    .fn()
    .mockImplementationOnce(() => nodeMailerStub.interactsWithMail.lastMail()),
};
describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sends an activation email', async () => {
    const mockTransport = nodeMailer.createTransport(stubTransport);
    const mail = await mockTransport.sendMail({
      from: 'from@domain.com',
      to: 'to@otherdomain.com',
      subject: 'Nodemailer stub works!',
      text: 'Wohoo',
    });

    const lastMail = mockMailService.lastMail(mail);
    expect(lastMail.to).toContain('to@otherdomain.com');
  });
});
