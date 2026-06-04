import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpacesApiService } from './spaces-api.service';
import {SpaceFilterParams} from "../models/space-filter-params";
import {CreateSpaceRequest} from '../models/create-space-request';
import {SpaceType} from '../models/space-type';

describe('SpacesApiService', () => {
  let service: SpacesApiService;
  let httpMock: HttpTestingController;

  const mockBaseUrl = 'http://localhost:5271/api/spaces';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpacesApiService]
    });
    service = TestBed.inject(SpacesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSpaces with correct params', () => {
    const filters: SpaceFilterParams = {
      limit: 10,
      offset: 0,
      city: 'New York',
      spaceType: SpaceType.Desk
    };

    const mockResponse = { items: [], totalItems: 0, page: 1, pageSize: 10 };

    service.filterSpaces(filters).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toBe(mockBaseUrl);
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('offset')).toBe('0');
    expect(req.request.params.get('city')).toBe('New York');
    expect(req.request.params.get('spaceType')).toBe(SpaceType.Desk.toString());

    req.flush(mockResponse);
  });

  it('should call createSpace with payload', () => {
    const payload: CreateSpaceRequest = {
      name: 'Test Space',
      description: 'Test Desc',
      spaceType: SpaceType.Desk,
      capacity: 1,
      areaSqm: 10,
      hourlyRate: 15,
      addressId: 1,
      isAvailable: true
    };

    const mockResponse = { id: 1 };

    service.createSpace(payload).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(mockBaseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  it('should call getSpace by id', () => {
    const mockSpace = { id: 1, name: 'Space 1' };

    service.getSpace(1).subscribe((res: any) => {
      expect(res.name).toBe('Space 1');
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpace);
  });

  it('should call getOwnerSpaces', () => {
    const mockSpaces = [{ id: 2, name: 'Owner Space' }];

    service.getOwnerSpaces().subscribe((res: any) => {
      expect(res).toEqual(mockSpaces);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/owner`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpaces);
  });

  it('should call deleteSpace', () => {
    service.deleteSpace(1).subscribe();

    const req = httpMock.expectOne(`${mockBaseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
