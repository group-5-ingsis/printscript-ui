import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers, User} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";

export class SnippetOperationsImpl implements SnippetOperations{

  private readonly getToken: () => Promise<string>;

  private readonly SNIPPETS_BASE_URL = import.meta.env.VITE_SNIPPETS_URL || '/snippets';

  constructor(getToken: () => Promise<string>) {
    this.getToken = getToken;
  }

  async getFormatRules(): Promise<Rule[]> {
    const token = await this.getToken();
    const url = `${this.SNIPPETS_BASE_URL}/format/rules`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('Network response was not ok:', response.status);
      }

      const data = await response.json();
      return data as Rule[];
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createSnippet)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data as Snippet;
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: updateSnippet.content
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data as Snippet;
    }

    async deleteSnippet(id: string): Promise<string> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/${id}`;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          console.log('Network response was not ok');
        }
          return await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return "error fetching";
      }
    }

    async formatSnippet(snippet: string): Promise<string> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/format`;

      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              body: snippet,
          });
  

          if (!response.ok) {
              console.log('Network response was not ok:', response.status);
              return '';
          }

          return await response.text();
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          return '';
      }
  }
  
  
  

    async getFileTypes(): Promise<FileType[]> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/language/types`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.log('Network response was not ok:', response.status);
        }

        const data = await response.json();
        return data as FileType[];
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
      }
    }


    async getLintingRules(): Promise<Rule[]> {
    const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/lint/rules`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          console.log('Network response was not ok:', response.status);
        }
  
        const data = await response.json();
        return data as Rule[];
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
      }
    }
  
      

    async getSnippetById(id: string): Promise<Snippet | undefined> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/id/${id}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          console.log('Network response was not ok');
        }
        const data = await response.json();
        return data as Snippet;
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return undefined;
      }
    }

    getTestCases(): Promise<TestCase[]> {
        return Promise.resolve([]);
    }

    async getUserFriends(name?: string, page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/users`;
      try {

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const users: User[] = await response.json();

        const filteredUsers = name
        ? users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()))
        : users;

        const count = filteredUsers.length;
        const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  
        return {
          page,
          page_size: pageSize,
          count,
          users: paginatedUsers,
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Could not fetch users');
      }
    }

  async listSnippetDescriptors(
    page: number,
    pageSize: number,
    snippetName?: string
  ): Promise<PaginatedSnippets> {
    const token = await this.getToken();

    const url = snippetName
      ? `${this.SNIPPETS_BASE_URL}/name/${snippetName}`
      : `${this.SNIPPETS_BASE_URL}/`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        page,
        page_size: pageSize,
        count: data.length || 0,
        snippets: data || [],
      };
    } catch (error) {
      console.error('There was an error fetching the snippet descriptors:', error);
      return {
        page,
        page_size: pageSize,
        count: 0,
        snippets: [],
      };
    }
  }


  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    const token = await this.getToken();
    const url = `${this.SNIPPETS_BASE_URL}/format/rules`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRules)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rules = await response.json();
        return rules;
    } catch (error) {
        console.error('Error updating format rules:', error);
        throw new Error('Could not update format rules');
    }
}


    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/lint/rules`;
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(newRules)
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

        return await response.json();
      } catch (error) {
          console.error('Error updating format rules:', error);
          throw new Error('Could not update format rules');
      }
    }

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        return Promise.resolve(undefined);
    }

    removeTestCase(id: string): Promise<string> {
        return Promise.resolve("");
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
      const token = await this.getToken();
      const url = `${this.SNIPPETS_BASE_URL}/share/${snippetId}/${userId}`;
      try {

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        return await response.json()
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Could not fetch users');
      }
    }

    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        return Promise.resolve(undefined);
    }

    
}