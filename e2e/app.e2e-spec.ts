import { IemrdashPage } from './app.po';

describe('iemrdash App', () => {
  let page: IemrdashPage;

  beforeEach(() => {
    page = new IemrdashPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
