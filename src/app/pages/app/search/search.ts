import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';

export interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'group' | 'hashtag';
  title: string;
  subtitle?: string;
  avatar?: string;
  description?: string;
  imageUrl?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  memberCount?: number;
  postCount?: number;
  lastActivity?: Date;
  tags?: string[];
}

export interface SearchFilter {
  label: string;
  value: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    Avatar,
    Badge,
    InputText,
    SelectButton
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  host: {
    'class': 'flex w-full h-full'
  }
})
export class Search implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  searchQuery: string = '';
  selectedFilter: SearchFilter | null = null;
  isSearching = false;
  hasSearched = false;
  
  searchFilters: SearchFilter[] = [
    { label: 'Tout', value: 'all', icon: 'pi pi-search', count: 0 },
    { label: 'Utilisateurs', value: 'user', icon: 'pi pi-users', count: 0 },
    { label: 'Publications', value: 'post', icon: 'pi pi-file', count: 0 },
    { label: 'Groupes', value: 'group', icon: 'pi pi-users', count: 0 },
    { label: 'Hashtags', value: 'hashtag', icon: 'pi pi-hashtag', count: 0 }
  ];
  
  searchResults: SearchResult[] = [];
  filteredResults: SearchResult[] = [];
  
  recentSearches: string[] = [
    'Angular development',
    'Shawiiz_z',
    '#typescript',
    'Design patterns'
  ];
  
  trendingHashtags: string[] = [
    '#angular',
    '#typescript',
    '#webdev',
    '#design',
    '#javascript',
    '#frontend'
  ];
  
  suggestedUsers: SearchResult[] = [];

  constructor(private router: Router) {
    this.selectedFilter = this.searchFilters[0];
  }

  ngOnInit(): void {
    this.generateMockData();
    this.generateSuggestedUsers();
    
    // Focus automatique sur l'input de recherche
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 100);
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;
    
    // Ajouter à l'historique des recherches récentes
    if (!this.recentSearches.includes(this.searchQuery)) {
      this.recentSearches.unshift(this.searchQuery);
      this.recentSearches = this.recentSearches.slice(0, 6);
    }

    // Simuler un délai de recherche
    setTimeout(() => {
      this.performSearch();
      this.isSearching = false;
    }, 800 + Math.random() * 600);
  }

  private performSearch(): void {
    const query = this.searchQuery.toLowerCase();
    
    // Filtrer les résultats selon la requête
    this.searchResults = this.getAllMockResults().filter(result => {
      return result.title.toLowerCase().includes(query) ||
             result.subtitle?.toLowerCase().includes(query) ||
             result.description?.toLowerCase().includes(query) ||
             result.tags?.some(tag => tag.toLowerCase().includes(query));
    });

    this.applyFilter();
    this.updateFilterCounts();
  }

  onFilterChange(filter: SearchFilter): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.selectedFilter || this.selectedFilter.value === 'all') {
      this.filteredResults = this.searchResults;
    } else {
      this.filteredResults = this.searchResults.filter(
        result => result.type === this.selectedFilter!.value
      );
    }
  }

  private updateFilterCounts(): void {
    this.searchFilters.forEach(filter => {
      if (filter.value === 'all') {
        filter.count = this.searchResults.length;
      } else {
        filter.count = this.searchResults.filter(result => result.type === filter.value).length;
      }
    });
  }

  onRecentSearchClick(search: string): void {
    this.searchQuery = search;
    this.onSearch();
  }

  onHashtagClick(hashtag: string): void {
    this.searchQuery = hashtag;
    this.onSearch();
  }

  onResultClick(result: SearchResult): void {
    switch (result.type) {
      case 'user':
        this.router.navigate(['/app/profile', result.id]);
        break;
      case 'group':
        // Navigate to group page
        console.log('Navigate to group:', result.id);
        break;
      case 'post':
        // Navigate to post detail
        console.log('Navigate to post:', result.id);
        break;
      case 'hashtag':
        this.searchQuery = result.title;
        this.onSearch();
        break;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.filteredResults = [];
    this.hasSearched = false;
    this.selectedFilter = this.searchFilters[0];
    this.updateFilterCounts();
  }

  getResultIcon(type: string): string {
    switch (type) {
      case 'user': return 'pi pi-user';
      case 'post': return 'pi pi-file';
      case 'group': return 'pi pi-users';
      case 'hashtag': return 'pi pi-hashtag';
      default: return 'pi pi-search';
    }
  }

  getOnlineStatus(result: SearchResult): string {
    if (result.type !== 'user' || result.isOnline === undefined) {
      return '';
    }
    
    return result.isOnline ? 'En ligne' : 'Hors ligne';
  }

  formatMemberCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  trackByResult(index: number, result: SearchResult): string {
    return result.id;
  }

  private generateSuggestedUsers(): void {
    this.suggestedUsers = [
      {
        id: '2',
        type: 'user',
        title: 'Alexandre Martin',
        subtitle: '@Alex94',
        avatar: 'A',
        description: 'Designer UI/UX passionné',
        isOnline: true,
        isVerified: false
      },
      {
        id: '3',
        type: 'user',
        title: 'Marie Leroy',
        subtitle: '@Marie_L',
        avatar: 'M',
        description: 'Photographe professionnelle',
        isOnline: false,
        isVerified: true
      },
      {
        id: '4',
        type: 'user',
        title: 'John Developer',
        subtitle: '@JohnDev',
        avatar: 'J',
        description: 'Full-stack developer',
        isOnline: true,
        isVerified: false
      }
    ];
  }

  private generateMockData(): void {
    // Cette méthode sera complétée avec des données mock réalistes
  }

  private getAllMockResults(): SearchResult[] {
    return [
      // Utilisateurs
      {
        id: '2',
        type: 'user',
        title: 'Alexandre Martin',
        subtitle: '@Alex94',
        avatar: 'A',
        description: 'Designer UI/UX passionné | Créateur de belles interfaces 🎨',
        isOnline: true,
        isVerified: false,
        tags: ['design', 'ui', 'ux']
      },
      {
        id: '3',
        type: 'user',
        title: 'Marie Leroy',
        subtitle: '@Marie_L',
        avatar: 'M',
        description: 'Photographe professionnelle | Capturer la beauté du monde 📸',
        isOnline: false,
        isVerified: true,
        tags: ['photography', 'art', 'creative']
      },
      {
        id: '4',
        type: 'user',
        title: 'John Developer',
        subtitle: '@JohnDev',
        avatar: 'J',
        description: 'Full-stack developer | Angular & Node.js enthusiast 💻',
        isOnline: true,
        isVerified: false,
        tags: ['development', 'angular', 'nodejs', 'typescript']
      },
      
      // Publications
      {
        id: 'post1',
        type: 'post',
        title: 'Les meilleures pratiques Angular 2024',
        subtitle: 'Par @JohnDev',
        description: 'Un guide complet sur les dernières techniques et patterns Angular pour développer des applications modernes et performantes.',
        imageUrl: '/assets/images/post1.jpg',
        lastActivity: new Date('2025-09-28'),
        tags: ['angular', 'typescript', 'development', 'tutorial']
      },
      {
        id: 'post2',
        type: 'post',
        title: 'Design System : créer une cohérence visuelle',
        subtitle: 'Par @Alex94',
        description: 'Comment mettre en place un design system efficace pour vos projets web et mobile.',
        imageUrl: '/assets/images/post2.jpg',
        lastActivity: new Date('2025-09-27'),
        tags: ['design', 'ui', 'designsystem', 'frontend']
      },
      
      // Groupes
      {
        id: 'group1',
        type: 'group',
        title: 'Développeurs Angular France',
        subtitle: 'Communauté francophone',
        avatar: 'A',
        description: 'Communauté française des développeurs Angular. Partage de conseils, discussions techniques et entraide.',
        memberCount: 1247,
        postCount: 89,
        lastActivity: new Date('2025-09-29'),
        tags: ['angular', 'france', 'development', 'community']
      },
      {
        id: 'group2',
        type: 'group',
        title: 'UI/UX Designers Network',
        subtitle: 'Design & User Experience',
        avatar: 'U',
        description: 'Réseau de designers UI/UX. Partagez vos créations, obtenez des feedbacks et restez à jour sur les tendances.',
        memberCount: 892,
        postCount: 156,
        lastActivity: new Date('2025-09-28'),
        tags: ['design', 'ui', 'ux', 'creative']
      },
      
      // Hashtags
      {
        id: 'hashtag1',
        type: 'hashtag',
        title: '#angular',
        description: '1.2k publications cette semaine',
        postCount: 1247,
        tags: ['angular', 'development', 'frontend']
      },
      {
        id: 'hashtag2',
        type: 'hashtag',
        title: '#design',
        description: '856 publications cette semaine',
        postCount: 856,
        tags: ['design', 'ui', 'creative']
      },
      {
        id: 'hashtag3',
        type: 'hashtag',
        title: '#typescript',
        description: '634 publications cette semaine',
        postCount: 634,
        tags: ['typescript', 'development', 'programming']
      }
    ];
  }
}