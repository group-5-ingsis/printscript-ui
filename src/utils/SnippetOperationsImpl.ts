import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";

export class SnippetOperationsImpl implements SnippetOperations{

  private readonly getToken: () => Promise<string>;

  private readonly SNIPPETS_BASE_URL = import.meta.env.VITE_SNIPPETS_URL || 'snippets';

  constructor(getToken: () => Promise<string>) {
    this.getToken = getToken;
  }
  async getFormatRules(): Promise<Rule[]> {
    const token = await this.getToken();
    const url = `${this.SNIPPETS_BASE_URL}/format/rules`;
    console.log("URL: ", url)
    console.log("BASE URL: ", this.SNIPPETS_BASE_URL);
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

    async deleteSnippet(id: string): Promise<string> {
      const token = await this.getToken();
      try {
        const response = await fetch(`/${this.SNIPPETS_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.message;
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return "error fetching";
      }
    }

    formatSnippet(snippet: string): Promise<string> {
        return Promise.resolve("");
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


  getLintingRules(): Promise<Rule[]> {
        return Promise.resolve([]);
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
          throw new Error('Network response was not ok');
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

    getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        return Promise.resolve(undefined);
    }

  async listSnippetDescriptors(
    page: number,
    pageSize: number,
    snippetName?: string
  ): Promise<PaginatedSnippets> {
    const token = await this.getToken();
    const url = `${this.SNIPPETS_BASE_URL}/name/${snippetName}`;
    console.log(url);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        page,
        page_size: pageSize,
        count: data.length,
        snippets: data.content as Snippet[],
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

    modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        return Promise.resolve([]);
    }

    modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        return Promise.resolve([]);
    }

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        return Promise.resolve(undefined);
    }

    removeTestCase(id: string): Promise<string> {
        return Promise.resolve("");
    }

    shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        return Promise.resolve(undefined);
    }

    testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        return Promise.resolve(undefined);
    }

    updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
      
        return Promise.resolve(undefined);
    }
}